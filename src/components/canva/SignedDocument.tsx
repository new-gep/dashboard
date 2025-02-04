import { useContext, useEffect, useRef, useState } from 'react';
import Button from '../bootstrap/Button';
import Job_DocumentSignature from '../../api/post/Job_DocumentSignature';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../bootstrap/Modal';
// import { Canvas, FabricImage } from 'fabric';
import * as fabric from 'fabric';
import { toast } from 'react-toastify';
import Toasts from '../bootstrap/Toasts';
import Spinner from '../bootstrap/Spinner';
import GetCompanyDocument from '../../api/get/company/Document';
import { Input } from '../icon/material-icons';
import Icon from '../icon/Icon';
import AuthContext from '../../contexts/authContext';

interface Props {
  step?:any;
  where?:string | null;
  document: any;
  nameDocument:string | null;
  assignature: any;
  dynamic:boolean;
  modal:boolean,
  setModal:any,
  id: number,
  closeAfterSave?:any
}

export default function SignedDocument({modal, setModal ,document, assignature, nameDocument, dynamic, id, closeAfterSave, where = null, step = null}: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLCanvasElement>(null);
  const { userData } = useContext(AuthContext);
  const [canvas, setCanvas] = useState<any>(null);
  const [loader, setLoader] = useState(false)
  const inputFile = useRef(null);

  async function loadImage(base64: any): Promise<any> {
    try {
      const imagemFabric = await fabric.FabricImage.fromURL(
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
      const dataURL = canvasElement.toDataURL('png',100);
      let PropsUploadJob;
      if(where){
        PropsUploadJob = {
          file:dataURL,
          name:dynamic ? step == '1' ? 'dismissal_communication_dynamic' : 'dismissal_dynamic' : nameDocument ,
          id  :id,
          dynamic:dynamic ? nameDocument : null,
        };
      }else{
        PropsUploadJob = {
          file:dataURL,
          name:dynamic ? 'dynamic': nameDocument ,
          id  :id,
          dynamic:dynamic ? nameDocument : null,
        };
      }
      const response = await Job_DocumentSignature(PropsUploadJob);
      if(response.status == 200){
        await closeAfterSave();
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
        setLoader(false);
        return
      };
      toast(
        <Toasts
          icon={ 'Close' }
          iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
          title={ 'Erro! '}
        >
          Erro ao gerar documento assinado.
        </Toasts>,
        {
          closeButton: true ,
          autoClose: 5000 //
        }
      )
      setLoader(false)
    }
  };

  const findSignature = async () => {
    try{
      const response = await GetCompanyDocument(userData.cnpj,'signature');
      if(response.status == 200){
        const signature = await loadImage(response.path)
        signature.set({
          borderColor: 'black',
          cornerColor: 'black',
          cornerStrokeColor: 'black',
          cornerSize: 10, // Tamanho do manipulador para redimensionamento
        });
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        signature.left = (canvasWidth - signature.width! * signature.scaleX!) / 2;
        signature.top = (canvasHeight - signature.height! * signature.scaleY!) / 2;      
        signature.scaleToWidth(200);
        canvas.add(signature);
        canvas.renderAll();
        toast(
          <Toasts
            icon={ 'Check' }
            iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
            title={ 'Sucesso! '}
          >
            Sucesso, encontramos sua assinatura!
          </Toasts>,
          {
            closeButton: true ,
            autoClose: 5000 //
          }
        )
        return
      };
      toast(
        <Toasts
          icon={ 'Close' }
          iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
          title={ 'Erro! '}
        >
          Erro, não encontramos sua assinatura!
        </Toasts>,
        {
          closeButton: true ,
          autoClose: 5000 //
        }
      );
    }catch(e){
      console.log(e)
      console.log('erro inesperado')
    }
  };

  const openInput = async () =>{
    //@ts-ignore
    inputFile.current.click();
  };

  const handleUpSignature = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      // Faça algo com o arquivo aqui (upload, pré-visualização, etc.)
      const reader = new FileReader();
      reader.onload = async (e) => {
        //@ts-ignore
        const base64 = e.explicitOriginalTarget.result;
        const newSingature = await loadImage(base64)
        newSingature.set({
          borderColor: 'black',
          cornerColor: 'black',
          cornerStrokeColor: 'black',
          cornerSize: 10, // Tamanho do manipulador para redimensionamento
        });
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        newSingature.left = (canvasWidth - newSingature.width! * newSingature.scaleX!) / 2;
        newSingature.top = (canvasHeight - newSingature.height! * newSingature.scaleY!) / 2;      
        newSingature.scaleToWidth(200);
        canvas.add(newSingature);
        canvas.renderAll();
      };
      reader.readAsDataURL(file);
      
    }
  };

  const handleKeyDown = (event:any) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      removeSelectedObject();
    }
  };

  const removeSelectedObject = () => {
    try{
      // Obtém o objeto atualmente selecionado no canvas
      const activeObject = canvas.getActiveObject();
      // Verifica se há um objeto selecionado
      if (activeObject) {
        // Remove o objeto do canvas
        canvas.remove(activeObject);
        // Re-renderiza o canvas para refletir a mudança
        canvas.renderAll();
      } else {
          // Exibe uma mensagem se nenhum objeto estiver selecionado
          alert('Por favor, selecione um objeto para remover.');
        }
      }catch(e){
        console.log(e)
      }
  };


  useEffect(() => {
    window.document.addEventListener('keydown', handleKeyDown);

    const fetchData = async () => {
      try {
        if (assignature && document && sectionRef.current && canvasRef.current) {
          const canvas = new fabric.Canvas(canvasRef.current);
          setCanvas(canvas)
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
          
          return () => {
            window.document.removeEventListener('keydown', handleKeyDown);
            canvas.dispose();
          };
        };
        
      } catch (e) {
        console.log('Erro ao configurar o canvas:', e);
      }
    }
    fetchData();
  }, [document, assignature, modal, sectionRef.current, canvasRef.current]);


  return (
    <>
      <Modal isOpen={modal} setIsOpen={setModal} fullScreen={true}>
        <ModalHeader setIsOpen={setModal} >
          <div className='d-flex align-items-center justify-content-center'>
            <h2>Documento e Assinatura</h2>
          </div>
        </ModalHeader>
        <ModalBody>
            <>
              <section className='rounded-lg d-flex align-items-center justify-content-center p-5'  ref={sectionRef} >
                <canvas
                  className='rounded'
                  ref={canvasRef} 
                />
              </section>
            </>
        </ModalBody>
        <ModalFooter>
          <div className='col-12 d-flex justify-content-end mt-2 gap-4'>
            <input
              type="file"
              id="upload-file" // Importante: o id deve corresponder ao htmlFor do label
              ref={inputFile}
              onChange={handleUpSignature}
              className='d-none' // Esconde o input file
            />
            <Button
              color='warning'
              icon={'Search'}
              isLink={true} 
              className='d-flex gap-2 align-items-center'
              onClick={findSignature}
            >
              Buscar Assinatura
            </Button>
            <Button
              onClick={openInput}
              isLink={true} 
              color='info'
              icon={'Upload'}
              className='d-flex gap-2 align-items-center'
            >
              Carregar Assinatura
            </Button>
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
    </>
  );
}
