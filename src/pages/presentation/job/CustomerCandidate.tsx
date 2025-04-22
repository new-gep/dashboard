import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import { demoPagesMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import useDarkMode from '../../../hooks/useDarkMode';
import Collaborator from '../../../api/get/collaborator/Collaborator';
import Mask from '../../../function/Mask';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import CollaboratorFile from '../../../api/get/collaborator/CollaboratorFile';
import Toasts from '../../../components/bootstrap/Toasts';
import PicturePath from '../../../api/patch/Picture';
import PictureGet from '../../../api/get/picture/Picture';
import AuthContext from '../../../contexts/authContext';
import Job_One from '../../../api/get/job/Job_One';
import Job from '../../../api/patch/Job';

const Customer = () => {
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const { cpf } = useParams();
	const { jobId } = useParams();
	const { userData } = useContext(AuthContext);
	const [collaborator, setCollaborator] = useState<any>(null);
	const [AllPicture, setAllPicture] = useState<any>(null);
	const [picture, setPicture] = useState<any>(null);
	const [openDocument, setOpenDocument] = useState<boolean>(false);
	const [documentAvaliation, setDocumentAvaliation] = useState<string | null>(null);
	const [typeDocument, setTypeDocument] = useState<any>(null);
	const [typeChildren, setTypeChildren] = useState<any>(null);
	const [pathDocumentChildren, setPathDocumentChildren] = useState<any>(null);
	const [pathDocumentMain, setPathDocumentMain] = useState<any>(null);
	const [pathDocumentSecondary, setPathDocumentSecondary] = useState<any>(null);

	const goBack = () => {
		navigate(-1); // Volta à página anterior
	};

	const closeModal = () => {
		if (typeChildren) {
			closeSelectChildren();
			return;
		}
		setPathDocumentMain(null);
		setPathDocumentSecondary(null);
		setTypeDocument(null);
		setOpenDocument(false);
	};

	const selectChildren = (children: any) => {
		setTypeChildren(children.type);
		setPathDocumentChildren(children.base64Data);
		setDocumentAvaliation(`Birth_Certificate_${children.name}`);
	};

	const closeSelectChildren = () => {
		setTypeChildren(null);
		setPathDocumentChildren(null);
		setDocumentAvaliation(null);
	};

	const AvaliationPicture = async (avaliation: boolean) => {
		try {
			const params = {
				status: avaliation ? 'approved' : 'reproved',
				picture: documentAvaliation,
				id_user: userData.id,
			};
			const response = await PicturePath(params, cpf);
			console.log('response', response);
			if (response.status == 200) {
				const index = AllPicture.findIndex(
					(item: any) =>
						// @ts-ignore
						item.picture.toLowerCase() === documentAvaliation.toLowerCase(),
				);

				if (index !== -1) {
					AllPicture[index].status = avaliation ? 'approved' : 'reproved'; // Atualiza diretamente o status
					setAllPicture([...AllPicture]); // Cria uma nova referência para atualizar o estado
				}

				// AllPicture.some((item: any) =>item.picture.toLowerCase() === "cnh" && item.status === "reproved")
				closeModal();
				toast(
					<Toasts
						icon='VerifiedUser'
						iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Sucesso!'>
						A imagem foi {avaliation ? 'aprovada' : 'reprovada'} com sucesso.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, //
					},
				);
				// console.log(response)
			} else if (response.status == 400) {
				toast(
					<Toasts
						icon='Close'
						iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Erro!'>
						Erro 404, tente mais tarde
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, //
					},
				);
			} else {
				toast(
					<Toasts
						icon='Close'
						iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title='Erro!'>
						Erro ao desconhecido no documento do candidato, tente mais tarde
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, //
					},
				);
			}
		} catch (e) {
			toast(
				<Toasts
					icon='Close'
					iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title='Erro!'>
					Erro ao aprovar documento do candidato, tente mais tarde
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000, //
				},
			);
		}
	};

	const ViewDoc = async (document: string) => {
		let response: any;
		switch (document) {
			case 'rg':
				response = await CollaboratorFile(cpf, 'rg');
				setDocumentAvaliation('rg');
				break;
			case 'cnh':
				response = await CollaboratorFile(cpf, 'cnh');
				if (response.status == 500) {
					toast(
						<Toasts
							icon='Filter'
							iconColor='info' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Documento Opcional'>
							O candidato não enviou esse documento.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				setDocumentAvaliation('cnh');
				break;
			case 'voter':
				response = await CollaboratorFile(cpf, 'voter_registration');
				if (response.status == 500) {
					toast(
						<Toasts
							icon='Filter'
							iconColor='info' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Documento Opcional'>
							O candidato não enviou esse documento.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				setDocumentAvaliation('voter_registration');
				break;
			case 'work':
				response = await CollaboratorFile(cpf, 'work_card');
				setDocumentAvaliation('work_card');
				break;
			case 'school':
				response = await CollaboratorFile(cpf, 'school_history');
				setDocumentAvaliation('school_history');
				break;
			case 'address':
				response = await CollaboratorFile(cpf, 'address');
				console.log('response', response);
				setDocumentAvaliation('address');
				break;
			case 'children':
				if (Object.keys(collaborator.children).length <= 0) {
					toast(
						<Toasts
							icon='Block'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro!'>
							O candidato não tem filhos.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(cpf, 'children_certificate');
				break;
			case 'marriage':
				if (collaborator.marriage != '1') {
					toast(
						<Toasts
							icon='Block'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro!'>
							O candidato é solteiro.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(cpf, 'marriage_certificate');
				setDocumentAvaliation('marriage_certificate');
				break;
			case 'miltiar':
				if (collaborator.sex.toLowerCase() == 'f') {
					toast(
						<Toasts
							icon='Block'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro!'>
							Mulher não precisa de certificação militar.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(cpf, 'military_certificate');
				setDocumentAvaliation('military_certificate');
				break;
			default:
				console.log('desconhecido');
				return;
		}
		// console.log(response)
		setTypeDocument(response.type);
		switch (response.type) {
			case 'children':
				setPathDocumentMain(response.path);
				break;
			case 'pdf':
				setPathDocumentMain(response.path);
				break;
			default:
				if (Array.isArray(response.path)) {
					setPathDocumentMain(response.path[0]);
					setPathDocumentSecondary(response.path[1]);
				} else {
					setPathDocumentMain(response.path);
				}
				break;
		}
		setOpenDocument(true);
	};

	const aprovedProfile = async () => {
		try {
			if (jobId && Array.isArray(AllPicture)) {
				let pictures = AllPicture;
				pictures = pictures.filter(
					(pic) =>
						pic.picture !== 'CNH' &&
						pic.picture !== 'Voter_Registration' &&
						!pic.picture.toLowerCase().includes('medical') &&
						!pic.picture.toLowerCase().includes('signature') &&
						!pic.picture.toLowerCase().includes('dismissal'),
				);
				const isValid = pictures.every((item) => item.status === 'approved');
				if (!isValid) {
					return;
				}
				const response = await Job_One(jobId);

				if (response.status == 200) {
					const { candidates } = response.job;
					// @ts-ignore
					candidates.forEach((item) => {
						delete item.picture;
						delete item.name;
					});
					if (candidates[0].step > 0) return;
					const candidate = candidates.find((item: any) => item.cpf.toString() == cpf);
					if (candidate) {
						candidate.verify = true;
					}
					const params = {
						candidates: JSON.stringify(candidates),
					};
					const update = await Job(params, jobId);
				}
			}
		} catch (e) {
			toast(
				<Toasts
					icon='Close'
					iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title='Erro!'>
					Erro ao aprovar o candidato, tente mais tarde
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000, //
				},
			);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			// @ts-ignore
			const response = await Collaborator(cpf);
			const pictures = await PictureGet(cpf);
			setAllPicture(pictures.pictures);
			setCollaborator(response.collaborator);
			setPicture(response.picture);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (AllPicture) {
			aprovedProfile();
		}
	}, [AllPicture]);

	return (
		<PageWrapper title={demoPagesMenu.crm.subMenu.customer.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Button color='primary' isLink icon='ArrowBack' tag='a' onClick={goBack}>
						Voltar
					</Button>
				</SubHeaderLeft>
			</SubHeader>
			<Modal isOpen={openDocument} setIsOpen={closeModal} size='xl'>
				<ModalHeader>
					<div>
						<h1 className='mb-0 p-0'>Documento</h1>
						<p className='mt-0 p-0'>
							Avalie o documento {typeDocument == 'children' && 'dos filhos'}
						</p>
					</div>
				</ModalHeader>
				<ModalBody>
					{typeDocument == 'pdf' && (
						<iframe
							title='Conteúdo incorporado da página'
							src={pathDocumentMain}
							className='rounded-md left-5'
							style={{ height: '500px', width: '100%', borderRadius: '10px' }}
						/>
					)}
					{typeDocument == 'picture' && (
						<div className='d-flex gap-4'>
							<img
								title='Documento'
								src={pathDocumentMain}
								className='rounded-md left-5'
								style={{ height: '500px', width: '100%', borderRadius: '10px' }}
							/>

							{pathDocumentSecondary && (
								<img
									title='Documento'
									src={pathDocumentSecondary}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							)}
						</div>
					)}
					{typeDocument == 'children' && (
						<div className='d-flex gap-4'>
							{pathDocumentMain.map((path: any) => {
								return (
									<>
										{!typeChildren && !pathDocumentChildren && (
											<div>
												<Button
													onClick={() => selectChildren(path)}
													icon='ChildCare'
													isLight
													color={
														AllPicture && Array.isArray(AllPicture)
															? AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			`birth_certificate_${path.name.toLowerCase()}` &&
																		item.status === 'reproved',
																)
																? 'danger'
																: AllPicture.some(
																			(item: any) =>
																				item.picture.toLowerCase() ===
																					`birth_certificate_${path.name.toLowerCase()}` &&
																				item.status ===
																					'approved',
																	  )
																	? 'success'
																	: 'warning'
															: 'warning'
													}>
													{path.name}
												</Button>
											</div>
										)}
									</>
								);
							})}
							{typeChildren == 'pdf' && (
								<iframe
									title='Conteúdo incorporado da página'
									src={pathDocumentChildren}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							)}
							{typeChildren == 'picture' && (
								<img
									title='Documento'
									src={pathDocumentChildren}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							)}
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					{(typeDocument == 'pdf' || typeDocument == 'picture') && (
						<div className='d-flex gap-4'>
							<Button
								isLight
								color='danger'
								onClick={() => AvaliationPicture(false)}
								// size='lg'
							>
								Recusar
							</Button>
							<Button
								isLight
								color='success'
								onClick={() => AvaliationPicture(true)}
								// size='lg'
							>
								Aprovar
							</Button>
						</div>
					)}
					{typeDocument == 'children' && typeChildren == null && (
						<Button
							isLight
							color='info'
							onClick={closeModal}
							// size='lg'
						>
							Fechar
						</Button>
					)}
					{typeChildren && pathDocumentChildren && (
						<div className='d-flex gap-4'>
							<Button
								isLight
								color='light'
								onClick={closeSelectChildren}
								// size='lg'
							>
								Voltar
							</Button>
							<Button
								isLight
								onClick={() => AvaliationPicture(false)}
								color='danger'
								// size='lg'
							>
								Recusar
							</Button>
							<Button
								isLight
								color='success'
								onClick={() => AvaliationPicture(true)}
								// size='lg'
							>
								Aprovar
							</Button>
						</div>
					)}
				</ModalFooter>
			</Modal>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>
						{collaborator && collaborator.name}
					</span>
					{/* <span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{item.type}
					</span> */}
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12 d-flex justify-content-center'>
										<img
											className='rounded-circle'
											src={`${picture}`}
											width={125}
											height={125}
										/>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Mail'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{collaborator && collaborator.email}
														</div>
														<div className='text-muted'>Email</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='PhoneAndroid'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{collaborator &&
																Mask('phone', collaborator.phone)}
														</div>
														<div className='text-muted'>Celular</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<div>
								<CardHeader className='d-block'>
									<CardLabel icon='Tungsten'>
										<CardTitle tag='div' className='h5'>
											Informações
										</CardTitle>
									</CardLabel>
									{collaborator && collaborator.update_at && (
										<CardActions>
											atualizado às{' '}
											{collaborator &&
												Mask('lastUpdate', collaborator.update_at)}
											.
										</CardActions>
									)}
								</CardHeader>
							</div>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-warning rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Cake' size='3x' color='warning' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{collaborator &&
														Mask('birth', collaborator.birth)}
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													{collaborator &&
														Mask('date', collaborator.birth)}
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-info rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon
													icon='VolunteerActivism'
													size='3x'
													color='info'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{collaborator && collaborator.marriage == 1
														? 'Sim'
														: 'Não'}
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Casado(a)
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-primary rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='ChildCare' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{collaborator &&
														Object.keys(collaborator.children).length}
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Filhos
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-success rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon
													icon='Transgender'
													size='3x'
													color='success'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{collaborator && collaborator.sex}
												</div>
												<div className='text-muted mt-n2'>
													Sexo Biológico
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>
						<Card>
							<CardHeader className='d-flex'>
								<CardLabel icon='PhotoLibrary'>
									<CardTitle tag='div' className='h5'>
										Documentos
									</CardTitle>
								</CardLabel>
								<Button
									// className='bg-warning'
									isLight
									icon={
										AllPicture && Array.isArray(AllPicture)
											? (() => {
													let pictures = [...AllPicture];
													pictures = pictures.filter(
														(pic) =>
															pic.picture !== 'CNH' &&
															pic.picture !== 'Voter_Registration',
													);
													if (
														pictures.some(
															(item) => item.status === 'reproved',
														)
													) {
														return 'GppBad';
													}
													if (
														pictures.every(
															(item) => item.status === 'approved',
														)
													) {
														return 'GppGood';
													}
													return 'GppMaybe';
												})()
											: 'GppMaybe'
									}
									color={
										AllPicture && Array.isArray(AllPicture)
											? (() => {
													let pictures = [...AllPicture];
													pictures = pictures.filter(
														(pic) =>
															pic.picture !== 'CNH' &&
															pic.picture !== 'Voter_Registration',
													);
													if (
														pictures.some(
															(item) => item.status === 'reproved',
														)
													) {
														return 'danger';
													}
													if (
														pictures.every(
															(item) => item.status === 'approved',
														)
													) {
														return 'success';
													}
													return 'warning';
												})()
											: 'warning'
									}
								/>
							</CardHeader>
							<CardBody className='row gap-3'>
								<div className='row d-flex gap-3 gap-md-0'>
									<div className='col-xl-2'>
										<Button
											onClick={() => ViewDoc('rg')}
											className={`d-flex align-items-center col-12 bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'rg' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'rg' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'rg' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'rg' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'rg' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'rg' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='fw-bold fs-4 fs-md-3 mb-0'>
													<div className='fw-bold fs-3 mb-0'>RG</div>
												</div>
											</div>
										</Button>
									</div>
									<div className='col-xl-4'>
										<Button
											onClick={() => ViewDoc('cnh')}
											className={`d-flex col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'cnh' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'cnh' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'cnh' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'cnh' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'cnh' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'cnh' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														CNH{' '}
														<span className='fs-6 ms-2'>
															(opcional)
														</span>
													</div>
												</div>
											</div>
										</Button>
									</div>
									<div
										className={`col-xl-6 ${collaborator && Object.keys(collaborator.children).length <= 0 && 'opacity-50'}`}>
										<Button
											onClick={() => ViewDoc('voter')}
											className={`d-flex col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'voter_registration' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'voter_registration' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'voter_registration' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'voter_registration' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'voter_registration' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'voter_registration' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Título de Eleitor{' '}
														<span className='fs-6 ms-2'>
															(opcional)
														</span>
													</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row d-flex gap-3 gap-md-0'>
									<div className='col-xl-6 '>
										<Button
											onClick={() => ViewDoc('work')}
											className={`d-flex col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'work_card' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'work_card' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'work_card' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'work_card' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'work_card' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'work_card' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Carteira de Trabalho
													</div>
												</div>
											</div>
										</Button>
									</div>
									<div className='col-xl-6 '>
										<Button
											onClick={() => ViewDoc('school')}
											className={`d-flex col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'school_history' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'school_history' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'school_history' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'school_history' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'school_history' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'school_history' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Histórico Escolar
													</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row d-flex gap-3 gap-md-0'>
									<div className='col-xl-8'>
										<Button
											onClick={() => ViewDoc('address')}
											className={`d-flex col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'address' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'address' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'address' &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'address' &&
																					item.status ===
																						'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'address' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'address' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Comprovante de Endereço
													</div>
												</div>
											</div>
										</Button>
									</div>
									<div
										className={`col-xl-4  ${collaborator && Object.keys(collaborator.children).length <= 0 && 'opacity-50'}`}>
										<Button
											onClick={() => ViewDoc('children')}
											className={`d-flex align-items-center col-12 bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture
																	.toLowerCase()
																	.includes(
																		'birth_certificate',
																	) && item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.filter((item) =>
																	item.picture
																		.toLowerCase()
																		.includes(
																			'birth_certificate',
																		),
															  ).every(
																	(item) =>
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												{/* Ícone */}
												<div className='flex-shrink-0'>
													<Icon
														icon={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture
																				.toLowerCase()
																				.includes(
																					'birth_certificate',
																				) &&
																			item.status ===
																				'reproved',
																	)
																	? 'Close'
																	: AllPicture.filter((item) =>
																				item.picture
																					.toLowerCase()
																					.includes(
																						'birth_certificate',
																					),
																		  ).every(
																				(item) =>
																					item.status ===
																					'approved',
																		  )
																		? 'Check'
																		: 'QueryBuilder'
																: 'QueryBuilder'
														}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture
																				.toLowerCase()
																				.includes(
																					'birth_certificate',
																				) &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.filter((item) =>
																				item.picture
																					.toLowerCase()
																					.includes(
																						'birth_certificate',
																					),
																		  ).every(
																				(item) =>
																					item.status ===
																					'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												{/* Texto */}
												<div className='ms-3'>
													<div className='fw-bold fs-3 mb-0'>Filhos</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row d-flex gap-3 gap-md-0'>
									<div
										className={`col-xl-7 ${collaborator && collaborator.marriage !== '1' && 'opacity-50'}`}>
										<Button
											onClick={() => ViewDoc('marriage')}
											className={`d-flex align-items-center col-12 bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'marriage_certificate' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'marriage_certificate' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={`${
															collaborator &&
															collaborator.marriage.toLowerCase() !==
																'1'
																? 'Block'
																: AllPicture &&
																	  Array.isArray(AllPicture)
																	? AllPicture.some(
																			(item: any) =>
																				item.picture.toLowerCase() ===
																					'marriage_certificate' &&
																				item.status ===
																					'reproved',
																		)
																		? 'Close'
																		: AllPicture.some(
																					(item: any) =>
																						item.picture.toLowerCase() ===
																							'marriage_certificate' &&
																						item.status ===
																							'approved',
																			  )
																			? 'Check'
																			: 'QueryBuilder'
																	: 'QueryBuilder'
														} 
														`}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'marriage_certificate' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'marriage_certificate' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Certidão de Casamento
													</div>
												</div>
											</div>
										</Button>
									</div>

									<div
										className={`col-xl-5 ${collaborator && collaborator.sex.toLowerCase() == 'f' && 'opacity-50'}`}>
										<Button
											onClick={() => ViewDoc('miltiar')}
											className={`d-flex  col-12 align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-${
												AllPicture && Array.isArray(AllPicture)
													? AllPicture.some(
															(item: any) =>
																item.picture.toLowerCase() ===
																	'military_certificate' &&
																item.status === 'reproved',
														)
														? 'danger'
														: AllPicture.some(
																	(item: any) =>
																		item.picture.toLowerCase() ===
																			'military_certificate' &&
																		item.status === 'approved',
															  )
															? 'success'
															: 'warning'
													: 'warning'
											} rounded-2 p-3`}>
											<div className='d-flex align-items-center'>
												<div className='flex-shrink-0'>
													<Icon
														icon={`${
															collaborator &&
															collaborator.sex.toLowerCase() == 'f'
																? 'Block'
																: AllPicture &&
																	  Array.isArray(AllPicture)
																	? AllPicture.some(
																			(item: any) =>
																				item.picture.toLowerCase() ===
																					'military_certificate' &&
																				item.status ===
																					'reproved',
																		)
																		? 'Close'
																		: AllPicture.some(
																					(item: any) =>
																						item.picture.toLowerCase() ===
																							'military_certificate' &&
																						item.status ===
																							'approved',
																			  )
																			? 'Check'
																			: 'QueryBuilder'
																	: 'QueryBuilder'
														} 
														`}
														size='3x'
														color={
															AllPicture && Array.isArray(AllPicture)
																? AllPicture.some(
																		(item: any) =>
																			item.picture.toLowerCase() ===
																				'military_certificate' &&
																			item.status ===
																				'reproved',
																	)
																	? 'danger'
																	: AllPicture.some(
																				(item: any) =>
																					item.picture.toLowerCase() ===
																						'military_certificate' &&
																					item.status ===
																						'approved',
																		  )
																		? 'success'
																		: 'warning'
																: 'warning'
														}
													/>
												</div>
												<div className={`flex-grow-1 ms-3 `}>
													<div className='fw-bold fs-4 fs-md-3 mb-0'>
														Certificado Militar
													</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='MapsHomeWork'>
									<CardTitle tag='div' className='h5'>
										Endereço
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-md-12'>
										<div className='row'>
											<div className='col-6 fw-bold fs-4'>
												{collaborator &&
													`${collaborator.street}, N° ${collaborator.number}`}
											</div>
											<div className='col-6 fw-bold fs-4'>
												{collaborator && collaborator.complement}
											</div>
										</div>
										<div className='row'>
											<div className='col-6 fs-4'>
												{collaborator && collaborator.district}
											</div>
											<div className='col-6 fs-4'>
												{collaborator &&
													`${collaborator.city}, ${collaborator.uf}`}
											</div>
										</div>
										<div>CEP: {collaborator && collaborator.zip_code}</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Customer;
