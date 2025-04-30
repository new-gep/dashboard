import { useContext, useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { toast } from 'react-toastify';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import Toasts from '../../../components/bootstrap/Toasts'; 
import Spinner from '../../../components/bootstrap/Spinner';
import GetCompanyDocument from '../../../api/get/company/Document';
import AuthContext from '../../../contexts/authContext';
import ContractSignature from '../../../api/post/company/Contract';

interface Props {
    modal: boolean;
    setModal: any;
    setNewSignaturePath:any;
    setSignaturePath:any;
    setControlButtons: any;
}

export default function CompanySignatureCanva({
    modal,
    setModal,
    setNewSignaturePath,
    setSignaturePath,
    setControlButtons,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [loader, setLoader] = useState(false);
    const [isErasing, setIsErasing] = useState(false);
    const [isCircleErasing, setIsCircleErasing] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const clearCanvas = () => {
        if (!canvas) {
            console.warn('Canvas não está inicializado');
            return;
        }
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
    };

    const removeSelectedObject = () => {
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.renderAll();
        }
    };

    const toggleEraseMode = () => {
        if (!canvas) return;

        setIsErasing(!isErasing);
        setIsCircleErasing(!isCircleErasing);

        if (!isErasing) {
            canvas.isDrawingMode = true;
            const eraserBrush = new fabric.PencilBrush(canvas);
            eraserBrush.color = '#ffffff';
            eraserBrush.width = 20;
            canvas.freeDrawingBrush = eraserBrush;
            // Define o cursor como 'none' para o canvas
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'none';
            }
        } else {
            canvas.isDrawingMode = true;
            const drawBrush = new fabric.PencilBrush(canvas);
            drawBrush.color = '#000000';
            drawBrush.width = 2;
            canvas.freeDrawingBrush = drawBrush;
            // Volta o cursor padrão
            if (canvasRef.current) {
                canvasRef.current.style.cursor = 'default';
            }
        }
    };

    const closeModal = () => {
        setIsCircleErasing(false)
        setModal(false)
    };

    const saveSignature = () => {
        const canvasElement = canvasRef.current;
      
        if (canvasElement) {
          const dataURL = canvasElement.toDataURL('image/png', 1.0);
          // Converte Base64 para Blob
          const blob = dataURLtoBlob(dataURL);
          const file = new File([blob], 'signature.png', { type: 'image/png' });
      
          setNewSignaturePath(file);
      
          const imageUrl = URL.createObjectURL(file);
          setSignaturePath(imageUrl);
          setControlButtons(true)
          closeModal();
        }
    };
      
    // Função para converter Base64 para Blob
    const dataURLtoBlob = (dataURL:any) => {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const byteCharacters = atob(parts[1]);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        return new Blob(byteArrays, { type: contentType });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        if (isErasing || isCircleErasing) {
            window.addEventListener('mousemove', handleMouseMove);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isErasing, isCircleErasing]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete') {
                removeSelectedObject();
            }
        };

        window.document.addEventListener('keydown', handleKeyDown);

        if (modal && sectionRef.current && canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                isDrawingMode: true,
                backgroundColor: '#ffffff',
            });

            fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
            fabricCanvas.freeDrawingBrush.color = '#000000';
            fabricCanvas.freeDrawingBrush.width = 2;

            const width = sectionRef.current.offsetWidth;
            const height = sectionRef.current.offsetHeight;

            if (width > 0 && height > 0) {
                fabricCanvas.setWidth(width);
                fabricCanvas.setHeight(height);
            } else {
                fabricCanvas.setWidth(600);
                fabricCanvas.setHeight(400);
                console.warn('sectionRef não tem dimensões válidas, usando valores padrão');
            }

            setCanvas(fabricCanvas);
            fabricCanvas.renderAll();

            return () => {
                window.document.removeEventListener('keydown', handleKeyDown);
                fabricCanvas.dispose();
                setCanvas(null);
            };
        }
    }, [modal]);

    return (
        <>
            {(isCircleErasing) && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePos.y - 10,
                        left: mousePos.x - 10,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                />
            )}

            <Modal isOpen={modal} setIsOpen={closeModal}  fullScreen isStaticBackdrop>
                <ModalHeader setIsOpen={closeModal}>
                    <div className='d-flex align-items-center justify-content-center'>
                        <h2>Assinatura</h2>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <section
                        className='rounded-lg d-flex align-items-center justify-content-center p-5'
                        ref={sectionRef}
                        style={{ minHeight: '400px', minWidth: '600px' }}
                    >
                        <canvas
                            className='rounded'
                            ref={canvasRef}
                            style={{ border: '1px solid #ccc', width: '100%', height: '100%' }}
                        />
                    </section>
                </ModalBody>
                <ModalFooter>
                    <div className='col-12 d-flex justify-content-end mt-2 gap-4'>
                        <Button
                            color='primary'
                            isLight
                            icon='CleaningServices'
                            className='d-flex gap-2 align-items-center'
                            onClick={clearCanvas}
                        >
                            Apagar tudo
                        </Button>
                        <Button
                            isLight
                            icon={isCircleErasing ? 'edit' : 'Circle' }
                            color={ 'secondary'}
                            onClick={toggleEraseMode}
                        >
                            {isCircleErasing ? 'Caneta' : 'Borracha'}
                        </Button>
                        {loader ? (
                            <Button color='primary' className='d-flex gap-2 align-items-center'>
                                <Spinner isSmall />
                                Gerando documento assinado
                            </Button>
                        ) : (
                            <Button isLight icon='LibraryAdd' color='success' onClick={saveSignature}>
                                Salvar
                            </Button>
                        )}
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
}