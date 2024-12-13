import { useEffect, useRef, useState } from 'react';
import Button from '../bootstrap/Button';
import Job_DocumentSignature from '../../api/post/Job_DocumentSignature';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../bootstrap/Modal';
import { FabricImage, Canvas, } from 'fabric';
import { toast } from 'react-toastify';
import Toasts from '../bootstrap/Toasts';
import Spinner from '../bootstrap/Spinner';

interface Props {
  document: any;
  nameDocument:string | null;
  assignature: any;
  dynamic?:string;
  modal:boolean,
  setModal:any,
  id: number
}

export default function SignedDocument({modal, setModal ,document, assignature, nameDocument, dynamic, id}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLCanvasElement>(null);
  const [loader, setLoader] = useState(false)


  async function loadImage(base64: any): Promise<FabricImage> {
    try {
      const imagemFabric = await FabricImage.fromURL(
        base64,
        { crossOrigin: 'anonymous' }
      );
      return imagemFabric;
    } catch (error) {
      console.error('Erro ao carregar a imagem:', error);
      throw error; // Propaga o erro para ser tratado no useEffect
    }
  };

  async function saveImage(){
    const canvasElement = canvasRef.current;
    if(canvasElement){
      setLoader(true)
      if(dynamic && nameDocument){
        const fileName = nameDocument
					.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase()) 
					.replace(/^\w/, (c) => c.toUpperCase())  
					.replace(/\s+/g, ""); 
          console.log(fileName)
          return
      };
      const dataURL = canvasElement.toDataURL('png',100);
      const PropsUploadJob = {
        file:dataURL,
        name:nameDocument,
        id  :id,
        dynamic:dynamic
      };
      const response = await Job_DocumentSignature(PropsUploadJob)
     if(response.status == 200){
      setLoader(false)
      setModal(false)
      toast(
        <Toasts
          icon={ 'Check' }
          iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
          title={ '🥳 Parabéns! '}
        >
          Sucesso ao gerar documento assinado.
        </Toasts>,
        {
          closeButton: true ,
          autoClose: 5000 //
        }
      )
     }
    }
  };


  useEffect(() => {
    console.log(assignature)
    console.log(document)
    const fetchData = async () => {
      try {
        if (assignature && document && canvasRef.current && sectionRef.current) {
          const canvas = new Canvas(canvasRef.current);
          const sectionWidth = sectionRef.current.offsetWidth;
          const sectionHeight = sectionRef.current.offsetHeight;
          const canvasWidth = sectionWidth * 0.9;
          const canvasHeight = sectionHeight * 0.9;
          // canvas.setDimensions({
          //   width: canvasWidth,
          //   height: canvasHeight,
          // });
            
          const canvaDocument = await loadImage(
            document.type === 'pdf' ? document.picture : document.path
          );
          canvas.setDimensions({
            width: canvaDocument.width,
            height: canvaDocument.height,
          });
            
          // const docScaleFactor = Math.max(
          //     canvasWidth / canvaDocument.width,
          //     canvasHeight / canvaDocument.height
          // );
          // canvaDocument.scale(docScaleFactor)
          canvaDocument.set({
            // left: (canvasWidth - canvaDocument.width * docScaleFactor) / 2,
            // top: (canvasHeight - canvaDocument.height * docScaleFactor) / 2,
            lockRotation: true,
            selectable: false
          });

          const canvaSignature = await loadImage(assignature.path);
          canvaSignature.set({
                borderColor: 'black',
                cornerColor: 'black',
                cornerStrokeColor: 'black',
                cornerSize: 10, // Tamanho do manipulador para redimensionamento
          });
          canvaSignature.scaleToWidth(canvasWidth * 0.2);
          // canvaSignature.set({
          //   left: (canvasWidth - canvaDocument.width * docScaleFactor) / 2,
          //   top: (canvasHeight - canvaDocument.height * docScaleFactor) / 2 + canvaDocument.height * docScaleFactor + 20, // Adicionando 20 pixels para dar um espaçamento
          // });

          canvas.add(canvaDocument);
          canvas.add(canvaSignature);
          canvas.renderAll();
        }
      } catch (e) {
        console.log('Erro ao configurar o canvas:', e);
      }
    }
    fetchData();
  }, [document, assignature, modal]);
  
  return (
    <Modal isOpen={modal} setIsOpen={setModal} fullScreen={true}>
      <ModalHeader setIsOpen={setModal} >
        <div className='d-flex align-items-center justify-content-center'>
          <h2>Documento e Assinatura</h2>
        </div>
      </ModalHeader>
      <ModalBody>
        <>
          { document && assignature ?
          <>
            <section className='rounded-lg d-flex align-items-center justify-content-center p-5'  ref={sectionRef} >
              <canvas
                className='rounded'
                ref={canvasRef} 
              />
            </section>
          </>
          :
          <h5>Buscando as informações</h5>
          }
        </>
      </ModalBody>
      <ModalFooter>
        <div className='col-12 d-flex justify-content-end mt-2'>
          { loader ?
            <Button
              
              color='primary'
              className='d-flex gap-2 align-items-center'
            >
              <Spinner 
                isSmall={true}
              />
              
              Gerando documento assinado
            </Button>
          :
            <Button
            isLight={true}
            icon='LibraryAdd'
            color='primary'
            onClick={saveImage}
          >
            Gerar documento assinado
            </Button>
          }
        </div>
      </ModalFooter>
    </Modal>
  );
}
