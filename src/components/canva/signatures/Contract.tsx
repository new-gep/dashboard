  import { useContext, useEffect, useRef, useState } from 'react';
  import Button from '../../bootstrap/Button';
  import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../bootstrap/Modal';
  import * as fabric from 'fabric';
  import { toast } from 'react-toastify';
  import Toasts from '../../bootstrap/Toasts';
  import Spinner from '../../bootstrap/Spinner';
  import GetCompanyDocument from '../../../api/get/company/Document';
  import AuthContext from '../../../contexts/authContext';
  import ContractSignature from '../../../api/post/company/Contract';

  interface Props {
    documentContract: any;
    cnpj: any,
    modal:boolean,
    setModal:any,
    closeAfterSave?:any
  }

  export default function ContractSignedDocument({documentContract, modal, setModal , cnpj, closeAfterSave }: Props) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLCanvasElement>(null);
    const { userData } = useContext(AuthContext);
    const [canvas, setCanvas] = useState<any>(null);
    const [loader, setLoader] = useState(false)
    const [modalContract, setModalContract] = useState(false)
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

    async function loadText(e:any){
      e.preventDefault();
      const pointer = canvas.getPointer(e);

      const text = new fabric.IText("Digite aqui", {
        left: pointer.x,
        top: pointer.y,
        fontSize: 20,
        fill: "black",
        opacity: 1,
        visible: true,
        editable: true,
        selectable: true
      });

      canvas.add(text);
      canvas.setActiveObject(text);
    }

    async function saveImage(){
      const canvasElement = canvasRef.current;
      if(canvasElement){
        setLoader(true)
        const dataURL = canvasElement.toDataURL('png',100);
        let PropsUploadJob;

        PropsUploadJob = {
          file:dataURL,
          cnpj: cnpj,
        };
      
        const response = await ContractSignature(PropsUploadJob);
        if(response.status == 200){
          closeAfterSave()
          setModal(false)
          toast(
            <Toasts
              icon={ 'Check' }
              iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
              title={ '🥳 Parabéns! '}
            >
              Sucesso ao gerar contrato assinado.
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
            Erro ao gerar contrato assinado.
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
          const base64 = e.currentTarget.result;
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
      if (event.key === 'Delete') {
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
            // alert('Por favor, selecione um objeto para remover.');
          }
        }catch(e){
          console.log(e)
        }
    };

    useEffect(() => {
      window.document.addEventListener('keydown', handleKeyDown);
      const fetchData = async () => {
        try {
          console.log('document', document)
          if (document && sectionRef.current && canvasRef.current) {
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
              documentContract.type === 'pdf' ? documentContract.picture : documentContract.path
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
            canvas.add(canvaDocument);
            canvas.renderAll();      // Re-renderiza o canvas

            
            
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
    }, [document, modal, sectionRef.current, canvasRef.current]);


    return (
      <>
        <Modal
				isOpen={modalContract}
				setIsOpen={setModalContract}
				size={`lg`}>
				<ModalHeader setIsOpen={setModalContract}>
					<div>
						<h1 className='mb-0 p-0'>Contrato Completo</h1>
					</div>
				</ModalHeader>

				<ModalBody>
					<iframe
						title='Conteúdo incorporado da página'
						src={documentContract.path}
						className='rounded-md left-5'
						style={{ height: '500px', width: '100%', borderRadius: '10px' }}
					/>
				</ModalBody>

				<ModalFooter className='d-flex justify-content-between'>
					<></>
				</ModalFooter>
			</Modal>
      
        <Modal isOpen={modal} setIsOpen={setModal} fullScreen={true} isStaticBackdrop>
          <ModalHeader setIsOpen={setModal} >
            <div className='d-flex align-items-center justify-content-center'>
              <h2>Contrato e Assinatura</h2>
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
                color='success'
                icon={'Assignment'}
                isLink={true} 
                className='d-flex gap-2 align-items-center'
                onClick={() => setModalContract(true)}
              >
                Visualizar Contrato
              </Button>
              <Button
                color='light'
                icon={'Edit'}
                isLink={true} 
                className='d-flex gap-2 align-items-center'
                onClick={loadText}
              >
                Escrever Assinatura
              </Button>
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
              <Button 
                color='storybook' 
                isLink 
                type='reset'
                icon='Download' 
                onClick={() => {
                  // Verifica se o documento existe e tem um path válido
                  if (documentContract?.path) {
                    const link = document.createElement('a');
                    link.href = documentContract.path;
                    link.download = 'Contrato.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    toast(
                      <Toasts
                        icon={'Close'}
                        iconColor={'danger'}
                        title={'Erro!'}
                      >
                        Não foi possível fazer o download do contrato.
                      </Toasts>,
                      {
                        closeButton: true,
                        autoClose:5000
                      }
                    );
                  }
                }}>
                Download Contrato
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
                Gerar contrato assinado
                </Button>
              }
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
