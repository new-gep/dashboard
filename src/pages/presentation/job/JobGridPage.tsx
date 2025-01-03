import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import CommonGridJobItem from '../../_common/CommonGridJobItem';
import tableData from '../../../common/data/dummyProductData';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Badge from '../../../components/bootstrap/Badge';
import Input from '../../../components/bootstrap/forms/Input';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import { demoPagesMenu } from '../../../menu';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import { AbstractPicture } from '../../../constants/abstract';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import AuthContext from '../../../contexts/authContext';
import Job from '../../../api/post/Job';
import Mask from '../../../function/Mask';
import Toasts from '../../../components/bootstrap/Toasts';
import Job_Open from '../../../api/get/Job/Job_Open';
import Job_One from '../../../api/get/Job/Job_One';
import JobUpdate from '../../../api/patch/Job';
import JobDelete from '../../../api/delete/job/job';
import { toast } from 'react-toastify';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import { isArray } from 'util';
import Checks from '../../../components/bootstrap/forms/Checks';
type AbstractPictureKeys = keyof typeof AbstractPicture;
interface IValues {
	image   :any;
	PCD     : string;
	function: string;
	salary  : any;
	time    : any;
	journey : string;
	contract: string
	benefits: string;
	details : string;
	obligations : string;
};

interface Ijob {
	user_create ?: any;
	image:string;
	PCD     : string;
	function: string;
	salary  : any;
	time    : any;
	journey : string;
	contract: string
	benefits: string;
	details : string;
	obligations : string;
	CNPJ_company?: string;
};

interface IjobUpdate {
	image  :string;
	function: string;
	PCD     : string;
	salary  : any;
	journey: any;
	time    : any;
	contract: string
	benefits: string;
	details : string;
	obligations : string;
	user_edit ?:string;
};

const validate = (values: IValues) => {
	const errors: any = {};
	// Campos obrigatórios

	if (!values.function) {
		errors.function = 'Função é obrigatória';
	}
	if (!values.salary || values.salary <= 0) {
		errors.salary = 'Salário é obrigatório';
	}
	if (!values.time || values.time <= 0) {

		errors.time = 'Horas semanais são obrigatórias';
	} else if (values.time.length < 1) {

        errors.time = 'Horário mínimo é 1 digito';
	} else if (values.time.length > 3) {
        errors.time = 'Horário máximo é 3 digitos';
    }
	if (!values.journey) {
		errors.journey = 'Jornada é obrigatória';
	}
	if (!values.contract) {
		errors.contract = 'Contrato é obrigatório';
	}

	// Não validamos os campos opcionais (benefits, details, obligations)

	return errors;
};

const ProductsGridPage = () => {
	const { userData } = useContext(AuthContext);
	const [data, setData] = useState<any>(null);
	const [deleteModal,  setDeleteModal] = useState<boolean>(false);
	const [editItem,  setEditItem] = useState<IValues | null>(null);
	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>(null);
	const [nameImage, setNameImage] = useState<AbstractPictureKeys>('ballSplit');
	const [rebuild, setRebuild] = useState<number>(1);

	const formik = useFormik({
		initialValues: {
			function: '',
			PCD     : '0',
			salary  : '',
			time    : '',
			journey : '',
			contract: '',
			benefits: '',
			details : '',
			obligations : '',
			image: ''
		},
		validate,
		onSubmit: (values, { resetForm }) => {  
			values.image = nameImage;
			const job = values;
			createAndEditJob(job);
			if(!editItem){
				resetForm();
			}
			// setEditPanel(false); // Se você quiser desativar o painel de edição, mantenha essa linha
		},
	});

	const handleImageChange = (e: any) => {
		setImageFile(null);
		const file = e.target.files ? e.target.files[0] : null;
		if (file) {
		  const imageUrl = URL.createObjectURL(file); // Cria uma URL temporária
		  setImageFile(imageUrl); // Atualiza o estado com a URL da imagem
		}
	};

	const getRandomImage = () => {
		const keys = Object.keys(AbstractPicture) as Array<keyof typeof AbstractPicture>; // Defina o tipo correto das chaves
		const randomKey = keys[Math.floor(Math.random() * keys.length)]; // Escolhe uma chave aleatória
		setNameImage(randomKey)
		return AbstractPicture[randomKey]; // Retorna a imagem correspondente à chave aleatória
	};

	const createAndEditJob = async (job:Ijob) => {
		job.user_create  = userData.id;
		job.CNPJ_company = userData.cnpj;
		job.time = JSON.stringify({
			time   : job.time,
			journey: job.journey
		})
		if(editItem && 'id' in editItem){
			const update:IjobUpdate = job;
			update.user_edit = userData.id;
			delete update.journey; 
			const response = await JobUpdate(update, editItem.id);
			switch(response.status){
				case 200:
					setRebuild(rebuild + 1)
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Successo'}
						>
							Vaga editada com sucesso! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					setEditPanel(false);
					break;
				case 404:
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro'}
						>
							Algo deu errado, tente novamente! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					break
				case 500:
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'warning' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro'}
						>
							Erro interno, tente novamente! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					break;
				default:
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro Desconhecido'}
							
							>
							Algo deu errado, tente novamente! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					break;
			}
		}else{
			const response = await Job(job);
			switch (response.status) {
				case 201:
					setRebuild(rebuild + 1)
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Successo'}
							
							>
							Vaga criada com sucesso! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					setEditPanel(false);
					break;
				case 500:
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'warning' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro'}
							
							>
							Algo deu errado, tente novamente! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					break;
			
				default:
					toast(
						<Toasts
							icon={ 'Work' }
							iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro Desconhecido'}
							
							>
							Algo deu errado, tente novamente! 
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 3000 // Examples: 1000, 3000, ...
						}
					)
					break;
			};
		};
	};
	  
	const handleRemove = async (id: string) => {
		let response = await Job_One(id);
		setEditItem(response.job)
		setDeleteModal(true)
	};

	const deleteJob = async () => {
		if(editItem && 'id' in editItem){
			const response = await JobDelete(editItem.id)
			switch (response.status) {
				case 200:
						setDeleteModal(false)
						setRebuild(rebuild + 1)
						toast(
							<Toasts
								icon={ 'Work' }
								iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
								title={ 'Successo'}
							>
								Vaga deletada com sucesso! 
							</Toasts>,
							{
								closeButton: true ,
								autoClose: 3000 // Examples: 1000, 3000, ...
							}
						)
					break;
				case 404:
						setDeleteModal(false)
						setRebuild(rebuild + 1)
						toast(
							<Toasts
								icon={ 'Work' }
								iconColor={ 'warning' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
								title={ 'Erro'}
							>
								Não foi possivel deletar a vaga, algo deu errado!
							</Toasts>,
							{
								closeButton: true ,
								autoClose: 3000 // Examples: 1000, 3000, ...
							}
						)
					break;
				default:
					setDeleteModal(false)
						setRebuild(rebuild + 1)
						toast(
							<Toasts
								icon={ 'Work' }
								iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
								title={ 'Erro'}
							>
								Erro interno, tente mais tarde!
							</Toasts>,
							{
								closeButton: true ,
								autoClose: 3000 // Examples: 1000, 3000, ...
							}
						)
					break;
			}
		}
	};

	const handleEdit = async (id: string) => {
		let response = await Job_One(id);
		setEditItem(response.job)
	};

	useEffect(() => {
		if (editItem) {
			formik.setValues({
			function: editItem.function,
			PCD     : editItem.PCD,
			salary  : editItem.salary,
			time    : editItem.time.time,
			journey : editItem.time.journey,
			contract: editItem.contract,
			benefits: editItem.benefits,
			details : editItem.details,
			obligations : editItem.obligations,
			image: editItem.image
			});
			setNameImage(editItem.image)
		}
	}, [editItem]);

	useEffect(() => {
		setImageFile(getRandomImage());
		if(userData.cnpj){
			const fetchData = async () => {
				const response = await Job_Open(userData.cnpj)
				console.log('job:', response)
				switch (response.status) {
					case 200:
						setData(response.job)
						break;
					default:
						break;
				}
			};
			fetchData();
		}
	}, [userData, rebuild]);
	  

	return (
		<PageWrapper title={demoPagesMenu.sales.subMenu.vaga.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{
								title: demoPagesMenu.sales.subMenu.vaga.text,
								to: demoPagesMenu.sales.subMenu.vaga.path,
							},
						]}
					/>
					<SubheaderSeparator />
					{data && <span className='text-muted'>{data.length} vagas abertas</span>}
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						color='dark'
						isLight
						icon='Add'
						onClick={() => {
							setEditItem(null);
							setEditPanel(true);
						}}>
						Gerar Vaga
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Modal 
				isOpen={deleteModal} 
				setIsOpen={setDeleteModal} >
				<ModalHeader>
					<h5 >Deletar Vaga</h5>
				</ModalHeader>
				<ModalBody>
					Você tem certeza que deseja excluir a vaga  <span className='text-danger fw-medium'> {editItem && editItem.function} </span> ?
				</ModalBody>
				<ModalFooter className={ `` }>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setDeleteModal(false)}
					>
						Fechar
					</Button>
						<Button color='info' icon='Save'
							onClick={deleteJob}
						>
							Exluir
						</Button>
				</ModalFooter>
			</Modal>
			<Page>
				<div className='display-4 fw-bold py-3'>
					{ Array.isArray(data) && data.length > 0 ?
					"Todas Vagas em Aberto"
					:
					<>
						Nenhuma Vaga Aberta no Momento
						<p className='fs-4'>
							Gere uma vaga já
						</p>
					</>
					}
				</div>
				<div className='row'>
					{data && data.length > 0 &&
						data.map((item:any) => (
							<div key={item.id} className='col-xxl-3 col-xl-4 col-md-6'>
								<CommonGridJobItem
									id={item.id}
									isPCD={item.PCD}
									image={item.image}
									title_job={item.function}
									candidates={item.candidates}
									editAction={() => {
										setEditPanel(true);
										handleEdit(item.id);
									} }
									deleteAction={() => handleRemove(item.id)}								
								/>
							</div>
						))
					}
				</div>
			</Page>

			<OffCanvas
				setOpen={setEditPanel}
				isOpen={editPanel}
				isRightPanel
				tag='form'
				noValidate
				onSubmit={formik.handleSubmit}>
				<OffCanvasHeader setOpen={setEditPanel}>
					<OffCanvasTitle id='edit-panel'>
						{editItem?.function || 'Nova Vaga'}{' '}
						{editItem?.function ? (
							<Badge color='primary' isLight>
								Edit
							</Badge>
						) : (
							<Badge color='success' isLight>
								New
							</Badge>
						)}
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<Card>
						<CardHeader>
							<CardLabel icon='Photo' iconColor='info'>
								<CardTitle>Imagem da Vaga{!editItem && <p className='fs-6 fw-semibold'>(aleatório)</p>} </CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='row'>
								<div className='col-12'>
									{editItem ? (
										<img
											src={AbstractPicture[nameImage]}
											alt=''
											width={128}
											height={128}
											className='mx-auto d-block img-fluid mb-3 rounded'
										/>
									) : (
										<img
											src={imageFile}
											alt=''
											width={128}
											height={128}
											className='mx-auto d-block img-fluid mb-3 rounded'
										/>
										// <PlaceholderImage
										// 	width={128}
										// 	height={128}
										// 	className='mx-auto d-block img-fluid mb-3 rounded'
										// />
									)}
								</div>
								<div className='col-12'>
									{/* <div className='row g-4'>
										<div className='col-12'>
											<Input type='file' accept="image/*" autoComplete='photo' 
												onChange={(e)=>handleImageChange(e)}
											/>
										</div>
										<div className='col-12'>
											{editItem && (
												<Button
													color='dark'
													isLight
													icon='Delete'
													className='w-100'
													onClick={() => {
														setEditItem({ ...editItem, image: null });
													}}>
													Delete Image
												</Button>
											)}
										</div>
									</div> */}
								</div>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<CardLabel icon='Description' iconColor='success'>
								<CardTitle>Detalhes da Vaga</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='row g-4'>
								<div className='col-12'>
									-
								</div>
								<div className='col-12'>
									<FormGroup id='function' label='Função' isFloating>
										<Input
											className='text-capitalize'
											placeholder='Função'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.function}
											isValid={formik.isValid}
											isTouched={formik.touched.function}
											invalidFeedback={formik.errors.function}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='salary' label='Salario' isFloating>
										<Input									
											onChange={formik.handleChange}
											value={formik.values.salary}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.salary}
											invalidFeedback={formik.errors.salary}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='time' label='Horas semanais' isFloating>
										<Input
											max={3}
											min={1}
											placeholder='Horas semanais'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.time}
											isValid={formik.isValid}
											isTouched={formik.touched.time}
											invalidFeedback={formik.errors.time}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='journey'>
										<Select
											className='form-select fw-medium'
											required={true} 
											ariaLabel={''}
											placeholder={'Jornada'}	
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.journey}
											isValid={formik.isValid}
											isTouched={formik.touched.journey}
											invalidFeedback={formik.errors.journey}
											validFeedback='Ótimo!'								
										>
											<option value={'5x2'}>5x2</option>
											<option value={'6x1'}>6x1</option>
										</Select>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='contract'>
										<Select 
											className='form-select fw-medium'
											required={true} 
											ariaLabel={'Contratação'}
											placeholder={'Contratação'}	
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.contract}
											isValid={formik.isValid}
											isTouched={formik.touched.contract}
											invalidFeedback={formik.errors.contract}
											validFeedback='Ótimo!'	
										>
											<Option value={ 'clt' }>CLT</Option>
											<Option value={ 'pj' }>PJ </Option>
											<Option value={ 'contract' }>Contrato</Option>
										</Select>
									</FormGroup>
								</div>								
								<div className='col-12'>
									<FormGroup id='obligations' label='Obrigações (opcional)' isFloating>
										<Textarea
											onChange={formik.handleChange}
											value={formik.values.obligations}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.obligations}
											invalidFeedback={formik.errors.obligations}
											validFeedback='Ótimo!'
										>

										</Textarea>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='benefits' label='Benefícios (opcional)' isFloating>
										<Textarea
											onChange={formik.handleChange}
											value={formik.values.benefits}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.benefits}
											invalidFeedback={formik.errors.benefits}
											validFeedback='Ótimo!'
										>

										</Textarea>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='details' label='Detalhes (opcional)' isFloating>
										<Textarea
											onChange={formik.handleChange}
											value={formik.values.details}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.details}
											invalidFeedback={formik.errors.details}
											validFeedback='Ótimo!'
										>

										</Textarea>
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>
				</OffCanvasBody>
				<div className='p-3'>
					<Button
						color='info'
						icon='Save'
						type='submit'
						isDisable={!formik.isValid && !!formik.submitCount}>
						{editItem ? 'Editar' : 'Criar'}
					</Button>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default ProductsGridPage;
