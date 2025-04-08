import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { ApexOptions } from 'apexcharts';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import { demoPagesMenu } from '../../../menu';
import tableData from '../../../common/data/dummyProductData';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import Chart from '../../../components/extras/Chart';
import Accordion, { AccordionItem } from '../../../components/bootstrap/Accordion';
import PlaceholderImage from '../../../components/extras/PlaceholderImage';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import { AbstractPicture } from '../../../constants/abstract';
import Mask from '../../../function/Mask';
import Job_One from '../../../api/get/job/Job_One';
import JobDelete from '../../../api/delete/job/job';
import JobUpdate from '../../../api/patch/Job';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Toasts from '../../../components/bootstrap/Toasts';
import { toast } from 'react-toastify';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import AuthContext from '../../../contexts/authContext';
import Checks from '../../../components/bootstrap/forms/Checks';
import { AvatarPicture } from '../../../constants/avatar';

type AbstractPictureKeys = keyof typeof AbstractPicture;

interface IjobUpdate {
	journey: any;
	image: AbstractPictureKeys;
	PCD: string;
	function: string;
	salary: any;
	time: any;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	user_edit?: string;
	update_at?: string;
}

type TTabs = 'Detalhes' | 'Candidatos' | 'Editar';
interface ITabs {
	[key: string]: TTabs;
}

const validate = (values: IjobUpdate) => {
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

const JobViewPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { id } = useParams();
	const { userData } = useContext(AuthContext);
	const TABS: ITabs = {
		CANDIDATE: 'Candidatos',
		DETAILS: 'Detalhes',
		EDIT: 'Editar',
	};
	type AbstractPictureKeys = keyof typeof AbstractPicture;
	const [nameImage, setNameImage] = useState<AbstractPictureKeys>('ballSplit');
	// @ts-ignore
	const [activeTab, setActiveTab] = useState(TABS.DETAILS);
	const [editItem, setEditItem] = useState<IjobUpdate | null>(null);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [candidates, setCandidates] = useState<Array<object> | null>(null);
	const [userCreate, setuserCreate] = useState<any | null>(null);
	const [rebuild, setRebuild] = useState<number>(1);
	const navigate = useNavigate();

	const redirect = useCallback(() => navigate('/sales/grid'), [navigate]);

	const navigateToCustomer = (cpf: any) => {
		return navigate(`/sales/Job/Customer/${cpf}/${id}`);
	};

	const handleRemove = async () => {
		setDeleteModal(true);
	};

	const deleteJob = async () => {
		if (editItem && 'id' in editItem) {
			const response = await JobDelete(editItem.id);
			switch (response.status) {
				case 200:
					setDeleteModal(false);
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Successo'}>
							Vaga deletada com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					redirect();
					break;
				case 404:
					setDeleteModal(false);
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'warning'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro'}>
							Não foi possivel deletar a vaga, algo deu errado!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
				default:
					setDeleteModal(false);
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro'}>
							Erro interno, tente mais tarde!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
			}
		}
	};

	const editJob = async (job: any) => {
		if (editItem) {
			const update: IjobUpdate = job;
			update.time = JSON.stringify({
				time: job.time,
				journey: job.journey,
			});
			delete update.journey;
			update.user_edit = userData.id;
			const response = await JobUpdate(update, id);
			switch (response.status) {
				case 200:
					setRebuild(rebuild + 1);
					setActiveTab(TABS.DETAILS);
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Successo'}>
							Vaga editada com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
				case 404:
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro'}>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
				case 500:
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'warning'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro'}>
							Erro interno, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
				default:
					toast(
						<Toasts
							icon={'Work'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro Desconhecido'}>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					break;
			}
		}
	};

	const aprovedCandidate = async (candidate: any, index: number) => {
		if (!candidate.verify) {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Error</span>
				</span>,
				'Primeiro verifique os documentos, clicando em visualizar',
			);
			return;
		}

		if (candidates && candidates.length > index) {
			const updatedCandidates: any = [...candidates];
			updatedCandidates[index] = {
				...updatedCandidates[index],
				status: null,
				verify: null,
				step: 1,
			};
			setCandidates(updatedCandidates);
			//@ts-ignore
			const updatedCandidatesWithoutPicture = updatedCandidates.map((candidate) => {
				const { name, picture, ...rest } = candidate; // Desestruturação para excluir `picture`
				return rest;
			});
			const update = {
				candidates: JSON.stringify(updatedCandidatesWithoutPicture),
			};
			const response = await JobUpdate(update, id);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Check' size='lg' className='me-1' />
					<span>Sucesso</span>
				</span>,
				'Candidato passado para proxima fase!',
			);
		}
	};

	const reprovedCandidate = async (candidate: any, index: number) => {
		if (candidates && candidates.length > index) {
			const updatedCandidates: any = [...candidates];
			updatedCandidates[index] = {
				...updatedCandidates[index],
				status: false, // Definindo o status como reprovado
			};
			setCandidates(updatedCandidates);
			//@ts-ignore
			const updatedCandidatesWithoutPicture = updatedCandidates.map((candidate) => {
				const { name, picture, ...rest } = candidate; // Desestruturação para excluir `picture`
				return rest;
			});
			const update = {
				candidates: JSON.stringify(updatedCandidatesWithoutPicture),
			};
			const response = await JobUpdate(update, id);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Check' size='lg' className='me-1' />
					<span>Sucesso</span>
				</span>,
				'Candidato reprovado com sucesso!',
			);
		}
	};

	const restoreCandidate = async (candidate: any, index: number) => {
		if (candidates && candidates.length > index) {
			const updatedCandidates: any = [...candidates];
			updatedCandidates[index] = {
				...updatedCandidates[index],
				status: null, // Definindo o status como reprovado
				step: 0,
			};
			setCandidates(updatedCandidates);
			//@ts-ignore
			const updatedCandidatesWithoutPicture = updatedCandidates.map((candidate) => {
				const { name, picture, ...rest } = candidate; // Desestruturação para excluir `picture`
				return rest;
			});
			const update = {
				candidates: JSON.stringify(updatedCandidatesWithoutPicture),
			};
			const response = await JobUpdate(update, id);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Check' size='lg' className='me-1' />
					<span>Sucesso</span>
				</span>,
				'Candidato restaurado com sucesso!',
			);
		}
	};

	const formik = useFormik({
		initialValues: {
			function: '',
			PCD: '',
			salary: '',
			time: '',
			journey: '',
			contract: '',
			benefits: '',
			details: '',
			obligations: '',
			image: 'ballSplit',
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			values.image = nameImage;
			const job = values;
			editJob(job);
			// setEditPanel(false); // Se você quiser desativar o painel de edição, mantenha essa linha
		},
	});

	useEffect(() => {
		if (editItem) {
			formik.setValues({
				function: editItem.function,
				PCD: editItem.PCD,
				salary: editItem.salary,
				time: editItem.time.time,
				journey: editItem.time.journey,
				contract: editItem.contract,
				benefits: editItem.benefits,
				details: editItem.details,
				obligations: editItem.obligations,
				image: editItem.image,
			});
			// @ts-ignore
			setNameImage(editItem.image);
		}
	}, [editItem, rebuild]);

	useEffect(() => {
		const fetchData = async () => {
			//@ts-ignore
			let response = await Job_One(id);
			if(!response || response.status !== 200){
				console.log('aqui')
				return;
			}
			switch (response.status) {
				case 200:
					setEditItem(response.job);
					setuserCreate(response.userCreate);
					setCandidates(response.job.candidates);
					break;
				default:
					break;
			}
		};
		fetchData();
	}, [rebuild]);

	return (
		<PageWrapper title={demoPagesMenu.sales.subMenu.job.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='info' isLink icon='ArrowBack' onClick={() => navigate(-1)}>
						Voltar
					</Button>
					<SubheaderSeparator />
					<Avatar
						//@ts-ignore
						src={userCreate && userCreate.avatar ? AvatarPicture[userCreate.avatar] : AvatarPicture.default}
						size={32}
						color={userCreate && userCreate.color}
						title={userCreate && userCreate.id}
					/>
					<span>
						<strong className='text-capitalize'>{userCreate && userCreate.name}</strong>
					</span>
					<span className='text-muted'>Criador</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<span className='text-muted fst-italic me-2'>Última atualização:</span>
					<span className='fw-bold'>
						{editItem && editItem.update_at
							? Mask('lastUpdate', editItem.update_at)
							: 'Sem atualização'}
					</span>
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
				<ModalFooter className={``}>
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
				{editItem ? 
				<>
					<div className='display-4 fw-bold py-3 text-capitalize'>
						{editItem && editItem.function}
					</div>
					<div className='row h-100'>
						<div className='col-lg-4'>
							<Card stretch>
								<CardBody isScrollable>
									<div className='row g-3'>
										<div className='absolute'>
											{editItem?.PCD == '1' && (
												<div className='d-flex gap-2 '>
													<Icon icon='AccessibleForward' size={'2x'} />
													<p className='mt-2'>Vaga Afirmativa</p>
												</div>
											)}
										</div>
										<div className='col-12'>
											{editItem && (
												<img
													src={AbstractPicture[editItem.image]}
													alt=''
													width='100%'
													className='p-5'
												/>
											)}
										</div>
										<div className='col-12'>
											<Button
												icon='Summarize'
												color='info'
												className='w-100 p-3'
												isLight={activeTab !== TABS.DETAILS}
												onClick={() => setActiveTab(TABS.DETAILS)}>
												{TABS.DETAILS}
											</Button>
										</div>
										<div className='col-12'>
											<Button
												icon='People'
												color='info'
												className='w-100 p-3'
												isLight={activeTab !== TABS.CANDIDATE}
												onClick={() => setActiveTab(TABS.CANDIDATE)}>
												{TABS.CANDIDATE}
											</Button>
										</div>
										<div className='col-12'>
											<Button
												icon='Edit'
												color='success'
												className='w-100 p-3'
												isLight={activeTab !== TABS.EDIT}
												onClick={() => setActiveTab(TABS.EDIT)}>
												{TABS.EDIT}
											</Button>
										</div>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterLeft className='w-100'>
										<Button
											onClick={handleRemove}
											icon='Delete'
											color='danger'
											isLight
											className='w-100 p-3'>
											Deletar
										</Button>
									</CardFooterLeft>
								</CardFooter>
							</Card>
						</div>
						<div className='col-lg-8'>
							<Card
								stretch
								className='overflow-hidden'
								tag='form'
								noValidate
								onSubmit={formik.handleSubmit}>
								{activeTab === TABS.DETAILS && (
									<>
										<CardHeader>
											<CardLabel icon='Summarize' iconColor='info'>
												<CardTitle tag='div' className='h5'>
													Informações
												</CardTitle>
												<CardSubTitle tag='div' className='h6'>
													Detalhes da Vaga
												</CardSubTitle>
											</CardLabel>
										</CardHeader>
										<CardBody isScrollable>
											<div className='row'>
												<div className='col-lg-6'>
													<Card
														stretch
														shadow='sm'
														className={`bg-l${
															darkModeStatus ? 'o25' : '25'
														}-primary rounded-2`}>
														<CardHeader className='bg-transparent'>
															<CardLabel>
																<CardTitle>Salario</CardTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='d-flex align-items-center pb-3'>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='Savings'
																		size='4x'
																		color='primary'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-3 mb-0'>
																		R${' '}
																		{editItem &&
																			priceFormat(
																				editItem.salary,
																			)}
																	</div>
																</div>
															</div>
														</CardBody>
													</Card>
												</div>
												<div className='col-lg-6'>
													<Card
														stretch
														shadow='sm'
														className={`bg-l${
															darkModeStatus ? 'o25' : '25'
														}-secondary bg-l${
															darkModeStatus ? 'o50' : '10'
														}-secondary:hover transition-base rounded-2`}>
														<CardHeader className='bg-transparent'>
															<CardLabel>
																<CardTitle tag='h4' className='h5'>
																	Contrato
																</CardTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='d-flex align-items-center pb-3'>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='Construction'
																		size='4x'
																		color='secondary'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div
																		className={`fw-bold fs-3 mb-0 text-uppercase ${editItem && editItem.contract == 'contract' ? 'text-capitalize' : 'text-uppercase'}`}>
																		{editItem &&
																		editItem.contract == 'contract'
																			? 'Contrato'
																			: editItem?.contract}
																	</div>
																</div>
															</div>
														</CardBody>
													</Card>
												</div>
												<div className='col-lg-6'>
													<Card
														stretch
														shadow='sm'
														className={`bg-l${
															darkModeStatus ? 'o25' : '25'
														}-success rounded-2`}>
														<CardHeader className='bg-transparent'>
															<CardLabel>
																<CardTitle>Carga Horária</CardTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='d-flex align-items-center pb-3'>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='Schedule'
																		size='4x'
																		color='success'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-3 mb-0'>
																		{editItem &&
																			editItem.time &&
																			editItem.time.time}
																		h semanais
																	</div>
																</div>
															</div>
														</CardBody>
													</Card>
												</div>
												<div className='col-lg-6'>
													<Card
														stretch
														shadow='sm'
														className={`bg-l${
															darkModeStatus ? 'o25' : '25'
														}-info rounded-2`}>
														<CardHeader className='bg-transparent'>
															<CardLabel>
																<CardTitle>
																	Jornada de Trabalho
																</CardTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='d-flex align-items-center pb-3'>
																<div className='flex-shrink-0'>
																	<Icon
																		icon='DirectionsRun'
																		size='4x'
																		color='info'
																	/>
																</div>
																<div className='flex-grow-1 ms-3'>
																	<div className='fw-bold fs-3 mb-0'>
																		{editItem &&
																			editItem.time &&
																			editItem.time.journey}
																	</div>
																</div>
															</div>
														</CardBody>
													</Card>
												</div>
												<div className='col-12 shadow-3d-container'>
													<Accordion id='faq' shadow='sm'>
														<AccordionItem id='faq1' title='Obrigações'>
															{editItem && editItem.obligations ? (
																editItem.obligations
															) : (
																<p className='text-muted fw-semibold'>
																	Nada para mostrar aqui{' '}
																	<Icon
																		icon='SentimentNeutral '
																		size='2x'
																	/>{' '}
																</p>
															)}
														</AccordionItem>
														<AccordionItem id='faq2' title='Benefícios'>
															{editItem && editItem.benefits ? (
																editItem.benefits
															) : (
																<p className='text-muted fw-semibold'>
																	Nada para mostrar aqui{' '}
																	<Icon
																		icon='SentimentDissatisfied '
																		size='2x'
																	/>{' '}
																</p>
															)}
														</AccordionItem>
														<AccordionItem id='faq3' title='Detalhes'>
															{editItem && editItem.details ? (
																editItem.details
															) : (
																<p className='text-muted fw-semibold'>
																	Nada para mostrar aqui{' '}
																	<Icon
																		icon='SentimentVeryDissatisfied '
																		size='2x'
																	/>{' '}
																</p>
															)}
														</AccordionItem>
													</Accordion>
												</div>
											</div>
										</CardBody>
									</>
								)}
								{activeTab === TABS.CANDIDATE && (
									<>
										<CardHeader>
											<CardLabel icon='People' iconColor='info'>
												<CardTitle tag='div' className='h5'>
													Candidatos
												</CardTitle>
												<CardSubTitle tag='div' className='h6'>
													Colaboradores Inscritos
												</CardSubTitle>
											</CardLabel>
										</CardHeader>
										<CardBody isScrollable>
											<div className='row g-4'>
												{Array.isArray(candidates) && candidates.length > 0 ? (
													candidates.map((candidate: any, index: number) => (
														<div
															key={candidate.cpf}
															className='col-12 d-md-flex align-items-center'>
															<div className='flex-shrink-0 d-flex justify-content-center'>
																<img
																	src={`${candidate.picture}`}
																	alt='Foto do candidato'
																	width={64}
																	height={64}
																	className='rounded-circle'
																/>
															</div>
															<div className='flex-grow-1 ms-3 d-flex justify-content-center justify-content-md-between align-items-center m-2 '>
																<figure className='mb-0'>
																	<blockquote className='gap-2 align-items-center  blockquote mb-0 d-flex justify-content-center justify-content-md-start'>
																		<Icon
																			icon={
																				candidate.verify ||
																				candidate.step != '0'
																					? 'GppGood'
																					: 'GppMaybe'
																			}
																			color={
																				candidate.verify ||
																				candidate.step != '0'
																					? 'success'
																					: 'warning'
																			}
																			title={
																				candidate.verify ||
																				candidate.step != '0'
																					? 'documentos aprovado'
																					: 'documentos em espera'
																			}
																		/>
																		<p>{candidate.name}</p>
																	</blockquote>
																	<div className='d-flex align-items-center gap-2 justify-content-center justify-content-md-start'>
																		<p
																			className={`mb-0 ${candidate.status || candidate.step != '0' ? 'text-success' : candidate.status == null ? 'text-warning' : 'text-danger'}`}>
																			{candidate.status ||
																			candidate.step != '0'
																				? 'aprovado para próxima fase'
																				: candidate.status ==
																					null
																					? 'em espera'
																					: 'reprovado'}
																		</p>
																		{/* <Icon 
																					icon={
																						candidate.verify ? 'GppGood' : 'GppMaybe'
																					}
																					color={
																						candidate.verify ? 'success' : 'warning'
																					}
																					title={candidate.verify ? 'documentos aprovado' : 'documentos em espera'}
																				/> */}
																	</div>
																</figure>
															</div>
															<div className='d-flex flex-row gap-4'>
																<Button
																	icon='Check'
																	color='success'
																	isLight={true}
																	isDisable={
																		candidate.status == false ||
																		candidate.status ||
																		candidate.step != '0'
																	}
																	onClick={() =>
																		aprovedCandidate(
																			candidate,
																			index,
																		)
																	}>
																	aprovar
																</Button>
																<Button
																	icon='Visibility'
																	color='info'
																	isLight={true}
																	isDisable={
																		candidate.status == false ||
																		candidate.status ||
																		candidate.step != '0'
																	}
																	onClick={() =>
																		navigateToCustomer(
																			candidate.cpf,
																		)
																	}>
																	visualizar
																</Button>
																{candidate.status == false ||
																candidate.status ||
																candidate.step != '0' ? (
																	<Button
																		icon='Autorenew'
																		color='light'
																		isLight={true}
																		onClick={() =>
																			restoreCandidate(
																				candidate,
																				index,
																			)
																		}>
																		restaurar
																	</Button>
																) : (
																	<Button
																		icon='Close'
																		color='danger'
																		isLight={true}
																		onClick={() =>
																			reprovedCandidate(
																				candidate,
																				index,
																			)
																		}>
																		reprovar
																	</Button>
																)}
															</div>
														</div>
													))
												) : (
													<div>
														<p className='fw-bold fs-3'>
															Nenhum candidato cadastrado no momento
														</p>
													</div>
												)}
											</div>
										</CardBody>
									</>
								)}
								{activeTab === TABS.EDIT && (
									<>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='success'>
												<CardTitle tag='div' className='h5'>
													Editar
												</CardTitle>
												<CardSubTitle tag='div' className='h6'>
													Informações da Vaga
												</CardSubTitle>
											</CardLabel>
										</CardHeader>
										<CardBody isScrollable>
											<Card>
												<CardHeader>
													<CardLabel icon='Photo' iconColor='info'>
														<CardTitle>Imagem da Vaga</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody>
													<div className='row'>
														<div className='col-lg-12'>
															{editItem?.image ? (
																<img
																	src={
																		AbstractPicture[editItem.image]
																	}
																	alt=''
																	width={'25%'}
																	height={'25%'}
																	className='mx-auto d-block img-fluid mb-3'
																/>
															) : (
																<PlaceholderImage
																	width={128}
																	height={128}
																	className='mx-auto d-block img-fluid mb-3 rounded'
																/>
															)}
														</div>
														{/* <div className='col-lg-8'>
															<div className='row g-4'>
																<div className='col-12'>
																	<Input
																		type='file'
																		autoComplete='photo'
																	/>
																</div>
																<div className='col-12'>
																	<Button
																		color='dark'
																		isLight
																		icon='Delete'
																		// onClick={() => {
																		// 	setEditItem({
																		// 		...editItem,
																		// 		image: undefined,
																		// 	});
																		// }}
																		>
																		Delete Image
																	</Button>
																</div>
															</div>
														</div> */}
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
															<FormGroup id='pcd' isFloating>
																<Checks
																	type='switch'
																	label='PCD'
																	onChange={(
																		e: React.ChangeEvent<HTMLInputElement>,
																	) => {
																		formik.setFieldValue(
																			'PCD',
																			e.target.checked
																				? '1'
																				: '0',
																		);
																	}}
																	value={formik.values.PCD}
																	checked={formik.values.PCD === '1'}
																	isInline={true}
																/>
															</FormGroup>
														</div>
														<div className='col-12'>
															<FormGroup
																id='function'
																label='Função'
																isFloating>
																<Input
																	className='text-capitalize'
																	placeholder='Função'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.function}
																	isValid={formik.isValid}
																	isTouched={formik.touched.function}
																	invalidFeedback={
																		formik.errors.function
																	}
																	validFeedback='Ótimo!'
																/>
															</FormGroup>
														</div>
														<div className='col-12'>
															<FormGroup
																id='salary'
																label='Salario'
																isFloating>
																<Input
																	onChange={formik.handleChange}
																	value={formik.values.salary}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	isTouched={!!formik.touched.salary}
																	invalidFeedback={
																		typeof formik.errors.salary ===
																		'string'
																			? formik.errors.salary
																			: undefined
																	}
																	validFeedback='Ótimo!'
																/>
															</FormGroup>
														</div>
														<div className='col-12'>
															<FormGroup
																id='time'
																label='Horas semanais'
																isFloating>
																<Input
																	max={3}
																	min={1}
																	placeholder='Horas semanais'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.time}
																	isValid={formik.isValid}
																	isTouched={!!formik.touched.time}
																	invalidFeedback={
																		typeof formik.errors.time ===
																		'string'
																			? formik.errors.time
																			: undefined
																	}
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
																	isTouched={!!formik.touched.journey}
																	invalidFeedback={
																		typeof formik.errors.journey ===
																		'string'
																			? formik.errors.journey
																			: undefined
																	}
																	validFeedback='Ótimo!'>
																	<Option value={'5x2'}>5x2</Option>
																	<Option value={'6x1'}>6x1</Option>
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
																	invalidFeedback={
																		formik.errors.contract
																	}
																	validFeedback='Ótimo!'>
																	<Option value={'clt'}>CLT</Option>
																	<Option value={'pj'}>PJ </Option>
																	<Option value={'contract'}>
																		Contrato
																	</Option>
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
																	isTouched={
																		formik.touched.obligations
																	}
																	invalidFeedback={
																		formik.errors.obligations
																	}
																	validFeedback='Ótimo!'></Textarea>
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
																	invalidFeedback={
																		formik.errors.benefits
																	}
																	validFeedback='Ótimo!'></Textarea>
															</FormGroup>
														</div>
														<div className='col-12'>
															<FormGroup
																id='details'
																label='Detalhes (opcional)'
																isFloating>
																<Textarea
																	onChange={formik.handleChange}
																	value={formik.values.details}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	isTouched={formik.touched.details}
																	invalidFeedback={
																		formik.errors.details
																	}
																	validFeedback='Ótimo!'></Textarea>
															</FormGroup>
														</div>
													</div>
												</CardBody>
											</Card>
										</CardBody>
										<CardFooter>
											<CardFooterRight>
												<Button
													color='info'
													icon='Save'
													type='submit'
													isDisable={!formik.isValid && !!formik.submitCount}>
													Editar
												</Button>
											</CardFooterRight>
										</CardFooter>
									</>
								)}
							</Card>
						</div>
					</div>
				</>
				:
				<>
					<div className='display-4 fw-bold py-3 text-capitalize'>
						carregando...
					</div>
				</>
				}

			</Page>
		</PageWrapper>
	);
};

export default JobViewPage;
