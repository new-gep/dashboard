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
import CommonGridJobItem from '../../_common/CommonGridJobItem';
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
import Job_Open from '../../../api/get/job/Job_Open';
import Job_One from '../../../api/get/job/Job_One';
import JobUpdate from '../../../api/patch/Job';
import JobDelete from '../../../api/delete/job/job';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import Checks from '../../../components/bootstrap/forms/Checks';
import Mask from '../../../function/Mask';
import { useNavigate } from 'react-router-dom';
import FindCep from '../../../api/get/Cep';
import Spinner from '../../../components/bootstrap/Spinner';

type AbstractPictureKeys = keyof typeof AbstractPicture;

interface IValues {
	id?: any;
	image: any;
	PCD: string;
	DEI: string;
	function: string;
	salary: any;
	contract: string;
	model: string;
	responsibility: string;
	requirements: string;
	locality: string;
	cep: string;
	benefits?: any;
	skills?: any;
}

interface Ijob {
	user_create?: any;
	image: string;
	PCD: string;
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

interface IjobUpdate {
	image: string;
	function: string;
	PCD: string;
	salary: any;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	user_edit?: string;
}

const validate = (values: IValues) => {
	const errors: any = {};

	// Validações para campos obrigatórios
	if (!values.function) {
		errors.function = 'Função é obrigatória';
	}
	if (!values.salary || values.salary <= 0) {
		errors.salary = 'Salário deve ser maior que zero';
	}
	if (!values.model) {
		errors.model = 'Modelo de trabalho é obrigatório';
	}
	if (!values.contract) {
		errors.contract = 'Tipo de contratação é obrigatório';
	}
	if (!values.cep) {
		errors.cep = 'CEP é obrigatório';
	} else if (!/^\d{5}-?\d{3}$/.test(values.cep)) {
		errors.cep = 'CEP deve estar no formato 12345-678';
	}
	if (!values.locality) {
		errors.locality = 'Localidade é obrigatório';
	}
	if (!values.requirements) {
		errors.requirements = 'Responsabilidade é obrigatório';
	}
	if (!values.responsibility) {
		errors.responsibility = 'Responsabilidade é obrigatório';
	}

	return errors;
};

const ProductsGridPage = () => {
	const { userData } = useContext(AuthContext);
	const [data, setData] = useState<any>(null);
	const [newBenefitName, setNewBenefitName] = React.useState('');
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [editItem, setEditItem] = useState<IValues | null>(null);
	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<any>(null);
	const [nameImage, setNameImage] = useState<AbstractPictureKeys>('ballSplit');
	const [rebuild, setRebuild] = useState<number>(1);
	const [isResume, setIsResume] = useState<boolean>(true);
	const [searchTerm, setSearchTerm] = React.useState<any>('');
	const [AddBenefit, setAddBenefit] = React.useState<boolean>(false);
	const [benefit, setBenefit] = React.useState<any>([]);
	const [skills, setSkills] = React.useState<any>(
		[] as Array<{ id: number; icon: string; name: string; active: boolean }>,
	);
	const [load, setLoad] = React.useState<boolean>(false);
	const navigate = useNavigate();
	const options = [
		{ name: 'Adaptabilidade', icon: 'aa' },
		{ name: 'Banco de dados', icon: 'aa' },
		{ name: 'Comunicação', icon: 'aa' },
		{ name: 'Comprometimento', icon: 'aa' },
		{ name: 'Criatividade', icon: 'aa' },
		{ name: 'Design gráfico', icon: 'aa' },
		{ name: 'Edição de vídeos', icon: 'aa' },
		{ name: 'Flexibilidade', icon: 'aa' },
		{ name: 'Fluência em idiomas', icon: 'aa' },
		{ name: 'Gestão de contabilidade', icon: 'aa' },
		{ name: 'Gestão de redes sociais', icon: 'aa' },
		{ name: 'Gestão de tempo', icon: 'aa' },
		{ name: 'Liderança', icon: 'aa' },
		{ name: 'Linguagens de programação', icon: 'aa' },
		{ name: 'Microsoft Office', icon: 'aa' },
		{ name: 'Organização', icon: 'aa' },
		{ name: 'Pensamento analítico', icon: 'aa' },
		{ name: 'Pensamento lógico', icon: 'aa' },
		{ name: 'Planejamento', icon: 'aa' },
		{ name: 'Pesquisar informações', icon: 'aa' },
		{ name: 'Proatividade', icon: 'aa' },
		{ name: 'Relacionamento interpessoal', icon: 'aa' },
		{ name: 'Resiliência', icon: 'aa' },
		{ name: 'Resolução de problemas', icon: 'aa' },
		{ name: 'SEO', icon: 'aa' },
		{ name: 'Sentido de ética', icon: 'aa' },
		{ name: 'Softwares de Marketing', icon: 'aa' },
		{ name: 'Softwares de gestão de projetos', icon: 'aa' },
		{ name: 'Transparência', icon: 'aa' },
		{ name: 'Trabalho em equipe', icon: 'aa' },
	];

	const formik = useFormik({
		initialValues: {
			function: '',
			PCD: '0',
			DEI: '0',
			salary: '',
			locality: '',
			model: '',
			contract: '',
			requirements: '',
			responsibility: '',
			cep: '',
			image: '',
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			values.image = nameImage;
			const job = values;
			//@ts-ignore
			createAndEditJob(job);
			if (!editItem) {
				resetForm();
			}
			// setEditPanel(false); // Se você quiser desativar o painel de edição, mantenha essa linha
		},
	});

	const findCep = async () => {
		const response = await FindCep(formik.values.cep.replace(/\D/g, ''));
		if (response && response.erro) {
			toast(
				<Toasts icon='Close' iconColor='danger' title='Atenção'>
					Endereço não Encontrado
				</Toasts>,
				{ closeButton: true, autoClose: 1000 },
			);
			return;
		}
		const updatedValues = {
			...formik.values, // Mantém os valores atuais
			locality: `${response.estado}, ${response.localidade}`,
		};
		formik.setValues(updatedValues);
	};

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
		setNameImage(randomKey);
		return AbstractPicture[randomKey]; // Retorna a imagem correspondente à chave aleatória
	};

	const viewJob = async (action: string) => {
		if (action == 'resume') {
			setEditPanel(true);
			setIsResume(true);
			return;
		}
		if (action == 'edit') {
			setEditPanel(true);
			setIsResume(false);
			return;
		}
	};

	const handleToggleSkill = (
		e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } },
	) => {
		const selected = e.target.value;
		if (!selected) return;

		const alreadyAdded = skills.find((s: any) => s.name === selected);

		if (alreadyAdded) {
			// Se já existe, remove do skills
			setSkills((prev: any) => prev.filter((s: any) => s.name !== selected));
		} else {
			// Se não existe, adiciona
			const skillData = options.find((opt) => opt.name === selected);
			setSkills((prev: any) => [
				...prev,
				{
					id: Date.now(),
					name: skillData?.name || selected,
					icon: skillData?.icon || 'Lightbulb',
				},
			]);
		}

		// Limpa o input
		if ('target' in e) {
			e.target.value = '';
		}
		setSearchTerm('');
	};

	const filteredOptions = options
		.filter(
			(opt: any) =>
				opt.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!skills.some((s: any) => s.name === opt.name), // já selecionadas não aparecem
		)
		.slice(0, 3);

	const updateJob = async () => {
		setLoad(true);
		const PropsCreateJob = {
			default: formik.values,
			benefits: benefit,
			skills: skills,
			user_edit: userData.id,
			CNPJ_company: userData.cnpj,
		};
		console.log('PropsCreateJob: ', PropsCreateJob);
		try {
			const response = await JobUpdate(PropsCreateJob, editItem?.id);
			if (response.status !== 200) {
				toast(
					<Toasts
						icon='Work'
						iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Erro'>
						Não foi possivel editar a vaga, algo deu errado!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 2000, // Examples: 1000, 3000, ...
					},
				);
				return;
			}
			if (response.status === 200) {
				toast(
					<Toasts
						icon='Work'
						iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Successo'>
						Vaga editada com sucesso!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, // Examples: 1000, 3000, ...
					},
				);
				return;
			}
			toast(
				<Toasts
					icon='Work'
					iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title='Erro'>
					Erro desconhecido, tente mais tarde!
				</Toasts>,
				{
					closeButton: true,
					autoClose: 2000, // Examples: 1000, 3000, ...
				},
			);
		} catch (e) {
			console.log(e);
		} finally {
			setLoad(false);
		}
	};

	const formatMoney = (value: string) => {
		if (!value) return '';

		// Remove tudo que não for número
		let cleaned = value.replace(/\D/g, '');

		// Se for vazio, retorna R$ 0,00
		if (cleaned.length === 0) return 'R$ 0,00';

		// Converte para número e força no formato de centavos
		const numberValue = parseInt(cleaned, 10);

		// Divide por 100 para colocar centavos
		const floatValue = numberValue / 100;

		// Formata com padrão brasileiro (pt-BR)
		return floatValue.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});
	};

	const handleRemove = async (id: string) => {
		const response = await Job_One(id);
		setEditItem(response.job);
		setDeleteModal(true);
	};

	const deleteJob = async () => {
		if (editItem && 'id' in editItem) {
			const response = await JobDelete(editItem.id);
			switch (response.status) {
				case 200:
					setDeleteModal(false);
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon='Work'
							iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Successo'>
							Vaga deletada com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
				case 404:
					setDeleteModal(false);
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon='Work'
							iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro'>
							Não foi possivel deletar a vaga, algo deu errado!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
				default:
					setDeleteModal(false);
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon='Work'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro'>
							Erro interno, tente mais tarde!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
			}
		}
	};

	const handleEdit = async (id: string) => {
		const response = await Job_One(id);
		setEditItem(response.job);
	};

	React.useEffect(() => {
		if (formik.values.cep.length == 9) {
			findCep();
		}
	}, [formik.values.cep]);

	useEffect(() => {
		if (editItem) {
			formik.setValues({
				function: editItem.function,
				PCD: editItem.PCD,
				DEI: editItem.DEI,
				model: editItem.model,
				salary: editItem.salary,
				contract: editItem.contract,
				requirements: editItem.requirements,
				locality: editItem.locality,
				cep: editItem.cep,
				responsibility: editItem.responsibility,
				image: editItem.image,
			});
			const formattedBenefits = editItem.benefits.map((name: string, index: number) => ({
				id: index,
				icon: '', // ícone padrão se não encontrar
				name,
				active: true, // ou true, dependendo do seu fluxo
			}));
			const formattedSkills = editItem.skills.map((name, index) => ({
				id: index,
				icon: '', // ou um ícone se você tiver mapeado, tipo getIconByName(name)
				name,
				active: true, // ou false, depende do contexto
			}));
			setBenefit(formattedBenefits);
			setSkills(formattedSkills);
			setNameImage(editItem.image);
		}
	}, [editItem]);

	useEffect(() => {
		setImageFile(getRandomImage());
		if (userData.cnpj) {
			const fetchData = async () => {
				const response = await Job_Open(userData.cnpj);

				if (!response || response.status !== 200) {
					return;
				}
				switch (response.status) {
					case 200:
						setData(response.job);
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
						homePath='/recruit/home'
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
							navigate('/recruit/create');
						}}>
						Gerar Vaga
					</Button>
				</SubHeaderRight>
			</SubHeader>

			<Modal isOpen={deleteModal} setIsOpen={setDeleteModal}>
				<ModalHeader>
					<h5>Deletar Vaga</h5>
				</ModalHeader>
				<ModalBody>
					Você tem certeza que deseja excluir a vaga{' '}
					<span className='text-danger fw-medium'> {editItem && editItem.function} </span>{' '}
					?
				</ModalBody>
				<ModalFooter className=''>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setDeleteModal(false)}>
						Fechar
					</Button>
					<Button color='info' icon='Save' onClick={deleteJob}>
						Exluir
					</Button>
				</ModalFooter>
			</Modal>

			<Page>
				<div className='display-4 fw-bold py-3'>
					{Array.isArray(data) && data.length > 0 ? (
						'Todas Vagas em Aberto'
					) : (
						<>
							Nenhuma Vaga Aberta no Momento
							<p className='fs-4'>Gere uma vaga já</p>
						</>
					)}
				</div>
				<div className='row'>
					{data &&
						data.length > 0 &&
						data.map((item: any) => (
							<div key={item.id} className='col-xxl-3 col-xl-4 col-md-6'>
								<CommonGridJobItem
									id={item.id}
									isPCD={item.PCD}
									isDEI={item.DEI}
									image={item.image}
									title_job={item.function}
									candidates={item.candidates}
									editAction={(action: any) => {
										handleEdit(item.id);
										viewJob(action);
									}}
									deleteAction={() => handleRemove(item.id)}
								/>
							</div>
						))}
				</div>
			</Page>

			<OffCanvas
				setOpen={setEditPanel}
				isBackdrop
				isOpen={editPanel}
				isRightPanel
				tag='form'
				noValidate>
				<OffCanvasHeader setOpen={!load && setEditPanel}>
					<OffCanvasTitle id='edit-panel' className='text-capitalize'>
						{editItem?.function}{' '}
						<Badge color='primary' isLight>
							Resumo
						</Badge>
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					{editItem ? 
					<>
						<Card>
							<CardHeader>
								<CardLabel icon='Photo' iconColor='info'>
									<CardTitle>
										Imagem da Vaga
										{!editItem && (
											<p className='fs-6 fw-semibold'>(aleatório)</p>
										)}{' '}
									</CardTitle>
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
									<div className='col-12 d-flex gap-5'>
										<div>
											<Checks
												disabled={isResume}
												isInline
												type='switch'
												label='DEI'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>,
												) => {
													const isChecked = event.target.checked;
													formik.setFieldValue('DEI', isChecked ? '1' : '0');
												}}
												checked={formik.values.DEI == '1'}
											/>
										</div>
										<div>
											<Checks
												disabled={isResume}
												isInline
												type='switch'
												label='PCD'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>,
												) => {
													const isChecked = event.target.checked;
													formik.setFieldValue('PCD', isChecked ? '1' : '0');
												}}
												checked={formik.values.PCD == '1'}
											/>
										</div>
									</div>

									<div className='col-12'>
										<FormGroup id='function' label='Função' isFloating>
											<Input
												disabled={isResume}
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
										<FormGroup id='salary' label='Salário' isFloating>
											<Input
												disabled={isResume}
												onChange={formik.handleChange}
												value={formatMoney(formik.values.salary)}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Ótimo!'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										{isResume ? (
											<FormGroup id='contract' label='Contrato' isFloating>
												<Input
													disabled={isResume}
													onChange={formik.handleChange}
													value={formik.values.contract}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										) : (
											<FormGroup id='contract' label='Contrato' isFloating>
												<Select
													className='form-select fw-medium'
													required={true}
													ariaLabel='Contratação'
													placeholder='Contratação'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.contract}
													isValid={formik.isValid}
													isTouched={formik.touched.contract}
													invalidFeedback={formik.errors.contract}
													validFeedback='Ótimo!'>
													<Option value='CLT'>CLT</Option>
													<Option value='PJ'>PJ</Option>
													<Option value='Contrato'>Contrato</Option>
												</Select>
											</FormGroup>
										)}
									</div>

									<div className='col-12'>
										{isResume ? (
											<FormGroup id='model' label='Modelo de Trabalho' isFloating>
												<Input
													disabled={isResume}
													onChange={formik.handleChange}
													value={formik.values.model}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										) : (
											<FormGroup id='model' label='Modelo de Trabalho' isFloating>
												<Select
													className='form-select fw-medium'
													required={true}
													ariaLabel='Modelo de Trabalho'
													placeholder='Modelo de Trabalho'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.model}
													isValid={formik.isValid}
													isTouched={formik.touched.model}
													invalidFeedback={formik.errors.model}
													validFeedback='Ótimo!'>
													<Option value='Presencial'>Presencial</Option>
													<Option value='Remoto'>Remoto</Option>
													<Option value='Híbrido'>Híbrido</Option>
												</Select>
											</FormGroup>
										)}
									</div>

									<div className='col-12'>
										<FormGroup id='location' label='Localidade' isFloating>
											<Input
												disabled={isResume}
												onChange={formik.handleChange}
												value={formik.values.locality}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Ótimo!'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										<FormGroup id='cep' label='CEP' isFloating>
											<Input
												disabled={isResume}
												onChange={formik.handleChange}
												value={Mask('cep', formik.values.cep)}
												mask='99999-999'
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Ótimo!'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										<FormGroup
											id='requirements'
											label='Responsabilidades'
											isFloating>
											<Textarea
												disabled={isResume}
												onChange={formik.handleChange}
												value={formik.values.requirements}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.requirements}
												invalidFeedback={formik.errors.requirements}
												validFeedback='Ótimo!'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										<FormGroup id='requirements' label='Requisitos' isFloating>
											<Textarea
												disabled={isResume}
												onChange={formik.handleChange}
												value={formik.values.requirements}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.requirements}
												invalidFeedback={formik.errors.requirements}
												validFeedback='Ótimo!'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										{!isResume && (
											<div className='relative w-full d-flex mb-3'>
												<Input
													type='text'
													className='form-input fw-medium pr-10 w-100'
													placeholder='Digite uma competência'
													value={searchTerm}
													onChange={(
														e: React.ChangeEvent<HTMLInputElement>,
													) => setSearchTerm(e.target.value)}
												/>
											</div>
										)}
										{searchTerm && (
											<div className='border mt-2 max-h-60 overflow-y-auto'>
												{filteredOptions.length > 0 ? (
													filteredOptions.map((opt: any) => (
														<div
															key={opt.name}
															className='p-2 hover:bg-gray-100 cursor-pointer'
															onClick={() => {
																handleToggleSkill({
																	target: { value: opt.name },
																} as any);
																setSearchTerm(''); // limpa o input
															}}>
															{opt.name}
														</div>
													))
												) : (
													<div className='p-2 text-gray-500'>
														Nenhuma competência encontrada
													</div>
												)}
											</div>
										)}
										<div>Competência</div>
										{skills
											? skills.map((item: any) => {
													return (
														<Button
															isDisable={isResume}
															color={'primary'}
															// isLink={item.active}
															icon={item.icon}
															className='text-capitalize'
															// size={'lg'}
															onClick={() => {
																setSkills((prev: any[]) =>
																	prev.filter(
																		(b) => b.id !== item.id,
																	),
																);
															}}>
															{item.name}
														</Button>
													);
												})
											: 'Nenhuma competência encontrada'}
									</div>

									<div className='col-12'>
										<div>Benefícios</div>
										{!AddBenefit ? (
											<div className='col-12 g-2'>
												{benefit.map((item: any) => {
													return (
														<Button
															isDisable={isResume}
															color={item.active ? 'primary' : 'light'}
															isLink={!item.active}
															icon={item.icon}
															className='text-capitalize'
															// size={'lg'}
															onClick={() => {
																setBenefit((prev: any[]) =>
																	prev.filter(
																		(b) => b.id !== item.id,
																	),
																);
															}}>
															{item.name}
														</Button>
													);
												})}
												{!isResume && (
													<Button
														className='text-capitalize'
														color='success'
														isLink={true}
														icon={'ControlPoint'}
														size={'lg'}
														onClick={() => {
															setAddBenefit(!AddBenefit);
														}}
													/>
												)}
											</div>
										) : (
											<div className='d-flex g-2 mt-1'>
												<Button
													color='danger'
													isLink={true}
													icon={'RemoveCircle'}
													size={'lg'}
													onClick={() => {
														setAddBenefit(!AddBenefit);
													}}
												/>

												<FormGroup
													className='col-8'
													id='Benefit'
													label='Benefício Adicional'
													isFloating>
													<Input
														className='text-capitalize'
														placeholder='Benefício Adicional'
														value={newBenefitName}
														onChange={(e: any) =>
															setNewBenefitName(e.target.value)
														}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>

												<Button
													color='success'
													icon={'CheckCircle'}
													size={'lg'}
													isLink={true}
													onClick={() => {
														if (!newBenefitName.trim()) return;
														const newBenefit = {
															id: benefit.length + 1, // ou use outro sistema de ID único se precisar
															icon: 'ControlPoint',
															name: newBenefitName,
															active: true,
														};
														setAddBenefit(!AddBenefit);
														setNewBenefitName('');
														setBenefit((prev: any) => [
															...prev,
															newBenefit,
														]);
													}}
												/>
											</div>
										)}
									</div>
								</div>
							</CardBody>
						</Card>
					</>
					:
					<div className='text-center h-100 w-100'>
						<h1>🔎 Buscando</h1>
					</div>
					}
				</OffCanvasBody>
				{!isResume &&
					(load ? (
						<div className='p-3'>
							<Spinner />
						</div>
					) : (
						<div className='p-3'>
							<Button
								color='info'
								icon='Save'
								isDisable={!formik.isValid && !!formik.submitCount}
								onClick={updateJob}>
								Editar
							</Button>
						</div>
					))}
			</OffCanvas>
		</PageWrapper>
	);
};

export default ProductsGridPage;
