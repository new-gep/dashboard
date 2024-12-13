import React, { useRef, useState, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Page } from 'react-pdf';

interface Props {
    document: any;
    assignature: any;
}

export default function PDFSignature({ document, assignature }: Props) {
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
    const [numPages, setNumPages] = useState(0);
    const iframeRef = useRef<any>(null);

    const handleDrop = async (e: React.DragEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        // ... (lógica para inserir a assinatura no PDF) ...
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    useEffect(() => {
        const iframe = iframeRef.current;
        const handleIframeClick = async (event: MouseEvent) => {
            // Verifique se o iframe é acessível
            if (!iframe || !iframe.contentWindow) return;

            const iframeRect = iframe.getBoundingClientRect();

            // Coordenadas dentro da tela
            const x = event.clientX - iframeRect.left;
            const y = event.clientY - iframeRect.top;

            console.log('X:', x, 'Y:', y);
            
            // A partir daqui, você pode usar essas coordenadas para adicionar a assinatura no PDF
        };

        // Verifique se o iframe está acessível antes de adicionar o evento de clique
        if (iframe) {
            iframe.contentWindow?.addEventListener('click', handleIframeClick);

            // Remover o event listener quando o componente for desmontado
            return () => {
                iframe.contentWindow?.removeEventListener('click', handleIframeClick);
            };
        }
    }, []);

    return (
        <div>
            {document.path && (
                <iframe
                    ref={iframeRef}
                    title="Conteúdo incorporado da página"
                    src={document.path}
                    className="rounded-md left-5"
                    style={{ height: '80vh', width: '100%', borderRadius: '10px' }}
                />
            )}
        </div>
    );
}
