import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
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
import Toasts from '../../../components/bootstrap/Toasts';
// Defina as chaves possíveis do objeto AbstractPicture
type AbstractPictureKeys = keyof typeof AbstractPicture;

interface IValues {
	image: string;
	function: string;
	salary: any;
	time: any;
	journey: string;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
}

interface Ijob {
	user_create?: any;
	image: string;
	function: string;
	salary: any;
	time: any;
	journey: string;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	CNPJ_company?: string;
}

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
	const [data, setData] = useState(tableData);
	const [editItem, setEditItem] = useState<IValues | null>(null);
	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>(null);
	const [nameImage, setNameImage] = useState<string>('');

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
		console.log(randomKey);
		setNameImage(randomKey);
		return AbstractPicture[randomKey]; // Retorna a imagem correspondente à chave aleatória
	};

	const createJob = async (job: Ijob) => {
		job.user_create = userData.id;
		job.CNPJ_company = userData.cnpj;
		// job.time = JSON.stringify({
		// 	time: job.time,
		// 	journey: job.journey
		// })
		const response = await Job(job);
		switch (response.status) {
			case 201:
				toast(
					<Toasts
						icon='Work'
						iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Successo'>
						Vaga criada com sucesso!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, // Examples: 1000, 3000, ...
					},
				);
				setEditPanel(false);
				break;
			case 500:
				toast(
					<Toasts
						icon='Work'
						iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Erro'>
						Algo deu errado, tente novamente!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, // Examples: 1000, 3000, ...
					},
				);
				break;
			default:
				toast(
					<Toasts
						icon='Work'
						iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Erro Desconhecido'>
						Algo deu errado, tente novamente!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, // Examples: 1000, 3000, ...
					},
				);
				break;
		}
	};

	const handleRemove = (id: number) => {
		const newData = data.filter((item) => item.id !== id);
		setData(newData);
	};

	const formik = useFormik({
		initialValues: {
			function: '',
			salary: '',
			time: '',
			journey: '',
			contract: '',
			benefits: '',
			details: '',
			obligations: '',
			image: '',
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			values.image = nameImage;
			const job = values;
			createJob(job);

			resetForm();
			// setEditPanel(false); // Se você quiser desativar o painel de edição, mantenha essa linha
		},
	});

	useEffect(() => {
		setImageFile(getRandomImage()); // Define uma imagem aleatória ao carregar o componente
	}, []);

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
					<span className='text-muted'>{data.length} vagas abertas</span>
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
			<Page>
				<div className='display-4 fw-bold py-3'>Todas Vagas em Aberto</div>
				<div className='row'>
					{data.map((item) => (
						<div key={item.id} className='col-xxl-3 col-xl-4 col-md-6'>
							{/* <CommonGridJobItem
								id={item.id}
								name={item.name}
								category={item.category}
								img={item.image}
								color={item.color}
								series={item.series}
								price={item.price}
								editAction={() => {
									setEditPanel(true);
									// handleEdit(item.id);
								}}
								deleteAction={() => handleRemove(item.id)}
							/> */}
						</div>
					))}
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
								<CardTitle>
									Imagem da Vaga <p className='fs-6 fw-semibold'>(aleatório)</p>{' '}
								</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='row'>
								<div className='col-12'>
									{imageFile ? (
										<img
											src={imageFile}
											alt=''
											width={128}
											height={128}
											className='mx-auto d-block img-fluid mb-3 rounded'
										/>
									) : (
										<PlaceholderImage
											width={128}
											height={128}
											className='mx-auto d-block img-fluid mb-3 rounded'
										/>
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
											required
											ariaLabel=''
											placeholder='Jornada'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.journey}
											isValid={formik.isValid}
											isTouched={formik.touched.journey}
											invalidFeedback={formik.errors.journey}
											validFeedback='Ótimo!'>
											<option value='5x2'>5x2</option>
											<option value='6x1'>6x1</option>
										</Select>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='contract'>
										<Select
											className='form-select fw-medium'
											required
											ariaLabel='Contratação'
											placeholder='Contratação'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.contract}
											isValid={formik.isValid}
											isTouched={formik.touched.contract}
											invalidFeedback={formik.errors.contract}
											validFeedback='Ótimo!'>
											<Option value='clt'>CLT</Option>
											<Option value='pj'>PJ </Option>
											<Option value='contract'>Contrato</Option>
										</Select>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup
										id='obligations'
										label='Obrigações (opcional)'
										isFloating>
										<Textarea
											onChange={formik.handleChange}
											value={formik.values.obligations}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.obligations}
											invalidFeedback={formik.errors.obligations}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup
										id='benefits'
										label='Benefícios (opcional)'
										isFloating>
										<Textarea
											onChange={formik.handleChange}
											value={formik.values.benefits}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.benefits}
											invalidFeedback={formik.errors.benefits}
											validFeedback='Ótimo!'
										/>
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
										/>
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
						Criar
					</Button>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default ProductsGridPage;
