import { useRef, useState } from 'react';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';
import Button from '../../../components/bootstrap/Button';
import PostCompanyDocument from '../../../api/post/company/Document';
import Spinner from '../../../components/bootstrap/Spinner';
import CompanySignatureCanva from './CompanySignatureCanva';

export default function CompanySignature({ loadDate ,TABS, setSignaturePath,  signaturePath, userData }) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [newSignaturePath, setNewSignaturePath] = useState<null | any>(null);
    const [controlButtons, setControlButtons] = useState<boolean>(false);
    const [canva, setCanva] = useState<boolean>(false);
	const [load, setLoad] = useState<boolean>(false);

	const saveSignature = async () => {
        setLoad(true)
		const PropsUpload = {
			file: newSignaturePath,
			document: 'Signature',
			cnpj: userData.cnpj,
		};

		const response = await PostCompanyDocument(PropsUpload);
		if (response.status !== 200) {
			toast(
				<Toasts icon='Close' iconColor='danger' title='Erro'>
					Algo deu errado, tente mais tarde.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000,
				},
			);
            setLoad(false)
			return;
		}
		toast(
			<Toasts icon='Check' iconColor='success' title='Sucesso'>
				Assinatura atualizada com sucesso.
			</Toasts>,
			{
				closeButton: true,
				autoClose: 1000,
			},
		);
        setControlButtons(false)
        setLoad(false)
	};

	const clickSignature = async () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const uploadSignature = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoad(true)
		const { files } = event.target;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				setNewSignaturePath(file);
				const imageUrl = URL.createObjectURL(file);
				setSignaturePath(imageUrl);
			} else {
				toast(
					<Toasts icon='Close' iconColor='danger' title='Erro'>
						Selecione <b>apenas</b> arquivo de imagem.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000,
					},
				);
			}
            setLoad(false)
            setControlButtons(true)
		}
        setLoad(false)
	};

	return (
		<Card stretch>
            {loadDate?
                <div className='h-100 w-100 d-flex align-items-center justify-content-center'>
                    <Spinner/>
                </div>
                :
                <>
                    <CompanySignatureCanva setControlButtons={setControlButtons} setSignaturePath={setSignaturePath} setNewSignaturePath={setNewSignaturePath}  modal={canva} setModal={setCanva}/>
                    <CardHeader>
                        <CardLabel icon='Edit' iconColor='info'>
                            <CardTitle>{TABS.SIGNATURE}</CardTitle>
                        </CardLabel>
                    </CardHeader>
                    <CardBody className='pb-0' isScrollable>
                        <div className='row g-4'>
                            <Card className={` ${signaturePath && 'bg-white overflow-hidden'}`}>
                                <CardBody
                                    className='d-flex justify-content-center align-items-center'
                                    style={{ height: '300px' }}>
                                    {signaturePath ? (
                                        <div className='rounded h-50 w-50 d-flex justify-content-center align-items-center'>
                                            <img
                                                src={signaturePath}
                                                alt='Assinatura da empresa'
                                                className='mx-auto d-block img-fluid mb-3 w-100'
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className='shadow-3d-up-hover w-full h-100 d-flex justify-content-center align-items-center cursor-pointer'
                                            onClick={clickSignature}>
                                            <div>
                                                <h1 className='m-0 p-0'>
                                                    Adicione sua Assinatura <Icon icon='AddCircle' />
                                                </h1>
                                                Não há assinaturas ativas
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    accept='image/*'
                                    className='d-none'
                                    onChange={uploadSignature}
                                />
                            </Card>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <CardFooterLeft>
                            {(signaturePath && !load) &&
                                <div>
                                    <Button
                                        color='info'
                                        icon='CloudUpload'
                                        isLink
                                        type='reset'
                                        onClick={clickSignature}>
                                        Upload
                                    </Button>

                                    <Button
                                        color='storybook'
                                        icon='Create'
                                        isLink
                                        type='reset'
                                        onClick={()=> setCanva(true)}>
                                        Desenhar
                                    </Button>
                                </div>
                            }
                        </CardFooterLeft>
                        <CardFooterRight>
                            {(newSignaturePath && controlButtons) && 
                                (load ? (
                                    <Spinner/>
                                ) : (
                                    <Button
                                        type='submit'
                                        icon='Save'
                                        color='info'
                                        isOutline
                                        onClick={saveSignature}>
                                        Salvar
                                    </Button>
                                ))}
                        </CardFooterRight>
                    </CardFooter>
                </>
            }
		</Card>
	);
}
