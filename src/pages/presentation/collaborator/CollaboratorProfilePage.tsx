import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { getUserDataWithId } from '../../../common/data/userDummyData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/icon/Icon';
import { dashboardPagesMenu } from '../../../menu';
import Badge from '../../../components/bootstrap/Badge';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Chart, { IChartOptions } from '../../../components/extras/Chart';
import dummyEventsData from '../../../common/data/dummyEventsData';
import { priceFormat } from '../../../helpers/helpers';
import EVENT_STATUS from '../../../common/data/enumEventStatus';
import Alert from '../../../components/bootstrap/Alert';
import CommonAvatarTeam from '../../../common/other/CommonAvatarTeam';
import COLORS from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import useTourStep from '../../../hooks/useTourStep';
import Collaborator from '../../../api/get/collaborator/Collaborator';
import Mask from '../../../function/Mask';
import Job_One from '../../../api/get/job/Job_One';
import DossieAdmission from './dossie/Admission';
import DossieDocument from './dossie/Document';
import DossiePayStub from './dossie/PayStub';
import DossiePoint from './dossie/Points';
import DossieResignation from './dossie/Resignation';
import ModalDemission from './modalDemission';
import Spinner from '../../../components/bootstrap/Spinner';

const CollaboratorProfilePage = () => {
	useTourStep(19);
	const TABS = {
		COLLABORATOR: 'Documento',
		ADMISSION: 'Admissão',
		RESIGNATION: 'Demissão',
		PAYSTUB: 'Holerite',
		POINT: 'Ponto',
	};
	const [activeTab, setActiveTab] = useState(TABS.COLLABORATOR);
	const { darkModeStatus } = useDarkMode();
	const { cpf } = useParams();
	const [collaborator, setCollaborator] = useState<any>(null);
	const [picture, setPicture] = useState<any>(null);
	const [job, setJob] = useState<any>(null);
	const [modalDemission, setModalDemission] = useState<any>(null);
	const [listen, setListen] = useState<number>(1);

	useEffect(() => {
		const fetchData = async () => {
			if (cpf) {
				const response = await Collaborator(cpf);
				if (response.status == 200) {
					setCollaborator(response.collaborator);
					setPicture(response.picture);
					
					const responseJob = await Job_One(response.collaborator.id_work);
					if (responseJob.status == 200) {
						setJob(responseJob.job);
					}
				}
			}
		};
		fetchData();
	}, [cpf, listen]);

	const startDemission = () => {
		setModalDemission(true);
	};

	const userTasks = dummyEventsData.filter((f) => f.assigned.username === 'CPF.username');

	return (
		<PageWrapper title={collaborator && Mask('firstName', collaborator.name)}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='info'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`../${dashboardPagesMenu.collaborator.path}`}>
						Voltar
					</Button>

					{/* <SubheaderSeparator />
					<CommonAvatarTeam isAlignmentEnd>
						<strong>Sports</strong> Team
					</CommonAvatarTeam> */}
				</SubHeaderLeft>
				{/* <SubHeaderRight>
					<span className='text-muted fst-italic me-2'>Last update:</span>
					<span className='fw-bold'>13 hours ago</span>
				</SubHeaderRight> */}
			</SubHeader>

			{collaborator && job ? (
				<Page>
					<ModalDemission
						listen={listen}
						setListen={setListen}
						collaborator={collaborator}
						job={job}
						openModal={modalDemission}
						closeModal={setModalDemission}
					/>
					<div className='pt-3 pb-5 d-flex align-items-center justify-content-between'>
						<span className='display-4 fw-bold me-3'>
							{collaborator && collaborator.name}
						</span>
						<span>
							<Button
								icon='DoorFront'
								color='danger'
								isOutline={true}
								size={'lg'}
								onClick={startDemission}>
								Desligar
							</Button>
						</span>
					</div>
					<div
						className='row'
						style={
							job && job.motion_demission
								? { filter: 'grayscale(70%)' } // Aplica o estilo condicionalmente
								: undefined // Sem estilo adicional caso a condição seja falsa
						}>
						<div className='col-lg-4'>
							<Card className='shadow-3d-info'>
								<CardBody>
									<div className='row g-5'>
										<div className='col-12 d-flex justify-content-center'>
											{collaborator && <Avatar src={picture} />}
										</div>
										<div className='col-12'>
											<div className='row g-2'>
												<div className='col-12'>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon='Cake'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{collaborator &&
																	Mask(
																		'dateFormatBrazil',
																		collaborator.birth,
																	)}
															</div>
															<div className='text-muted'>
																{collaborator &&
																	Mask(
																		'birth',
																		collaborator.birth,
																	)}
															</div>
														</div>
													</div>
												</div>
												<div className='col-12'>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon=' VolunteerActivism'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{collaborator &&
																collaborator.marriage == '1'
																	? 'Sim'
																	: 'Não'}
															</div>
															<div className='text-muted'>
																Casado(a)
															</div>
														</div>
													</div>
												</div>
												<div className='col-12'>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon='Mail'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0 '>
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
																icon='Phone'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{collaborator &&
																	`${Mask('phone', collaborator.phone)} `}
															</div>
															<div className='text-muted'>
																Contato
															</div>
														</div>
													</div>
												</div>
												<div className='col-12'>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<Icon
																icon='Tag'
																size='3x'
																color='info'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-5 mb-0'>
																{collaborator &&
																	`${Mask('firstName', collaborator.name)} ${Mask('secondName', collaborator.name)} `}
															</div>
															<div className='text-muted'>
																Nome Social
															</div>
														</div>
													</div>
												</div>
												<div className='col-12'>
													{collaborator && collaborator.PCD == '1' && (
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<Icon
																	icon='AccessibleForward'
																	size='3x'
																	color='info'
																/>
															</div>
															<div className='flex-grow-1 ms-3'>
																<div className='fw-bold fs-5 mb-0'>
																	PCD
																</div>
																<div className='text-muted'>
																	Pessoa com Deficiência
																</div>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
							<Card>
								{job && job.PCD == '1' && (
									<div className='px-4 mt-3'>
										<Icon icon='AccessibleForward' size={'2x'} />
									</div>
								)}
								<CardHeader>
									<CardLabel
										icon='Stream'
										className=' col-12'
										iconColor='warning'>
										<CardTitle
											tag='div'
											className='h4 d-flex justify-content-between'>
											{job && job.function}
										</CardTitle>
										<CardTitle tag='div' className='h6'>
											Função
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-4 align-items-center'>
										<div className='col-xl-6'>
											<div
												className={classNames(
													'd-flex align-items-center rounded-2 p-3',
													{
														'bg-l10-warning': !darkModeStatus,
														'bg-lo25-warning': darkModeStatus,
													},
												)}>
												<div className='flex-shrink-0'>
													<Icon
														icon='DoneAll'
														size='3x'
														color='warning'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0 text-uppercase'>
														{job && job.contract}
													</div>
													<div className='text-muted mt-n2 truncate-line-1'>
														Contrato
													</div>
												</div>
											</div>
										</div>
										<div className='col-xl-6'>
											<div
												className={classNames(
													'd-flex align-items-center rounded-2 p-3',
													{
														'bg-l10-info': !darkModeStatus,
														'bg-lo25-info': darkModeStatus,
													},
												)}>
												<div className='flex-shrink-0'>
													<Icon icon='Savings' size='3x' color='info' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>
														{job && priceFormat(job.salary)}
													</div>
													<div className='text-muted mt-n2 truncate-line-1'>
														Salário
													</div>
												</div>
											</div>
										</div>
										<div className='col-xl-6'>
											<div
												className={classNames(
													'd-flex align-items-center rounded-2 p-3',
													{
														'bg-l10-primary': !darkModeStatus,
														'bg-lo25-primary': darkModeStatus,
													},
												)}>
												<div className='flex-shrink-0'>
													<Icon
														icon='Schedule'
														size='3x'
														color='primary'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>
														{job && job.time.time}
													</div>
													<div className='text-muted mt-n2'>
														Carga Horária
													</div>
												</div>
											</div>
										</div>
										<div className='col-xl-6'>
											<div
												className={classNames(
													'd-flex align-items-center rounded-2 p-3',
													{
														'bg-l10-success': !darkModeStatus,
														'bg-lo25-success': darkModeStatus,
													},
												)}>
												<div className='flex-shrink-0'>
													<Icon
														icon='DirectionsRun'
														size='3x'
														color='success'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>
														{job && job.time.journey}
													</div>
													<div className='text-muted mt-n2'>
														Jornada de Trabalho
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-lg-8'>
							<Card className='shadow-3d-primary'>
								<CardHeader>
									<CardLabel icon='FolderOpen' iconColor='success'>
										<CardTitle tag='div' className='h5'>
											Dossiê
										</CardTitle>
									</CardLabel>
									{/* <CardActions>
										<Dropdown>
											<DropdownToggle>
												<Button color='info' icon='Compare' isLight>
													Compared to{' '}
													<strong>
														{Number(dayjs().format('YYYY')) - 1}
													</strong>
													.
												</Button>
											</DropdownToggle>
											<DropdownMenu isAlignmentEnd size='sm'>
												<DropdownItem>
													<span>
														{Number(dayjs().format('YYYY')) - 2}
													</span>
												</DropdownItem>
												<DropdownItem>
													<span>
														{Number(dayjs().format('YYYY')) - 3}
													</span>
												</DropdownItem>
											</DropdownMenu>
										</Dropdown>
									</CardActions> */}
								</CardHeader>

								<CardBody className='d-flex gap-5' style={{ height: '400px' }}>
									{/* BUTTON */}
									<Card stretch className='col-4'>
										<CardBody isScrollable className='h-100'>
											<div className='row g-3 '>
												<div className='col-12'>
													<Button
														icon='AttachFile'
														color='info'
														className='w-100 p-3'
														isLight={TABS.COLLABORATOR !== activeTab}
														onClick={() =>
															setActiveTab(TABS.COLLABORATOR)
														}>
														{TABS.COLLABORATOR}
													</Button>
												</div>
												<div className='col-12'>
													<Button
														icon='check'
														color='success'
														className='w-100 p-3'
														isLight={TABS.ADMISSION !== activeTab}
														onClick={() =>
															setActiveTab(TABS.ADMISSION)
														}>
														{TABS.ADMISSION}
													</Button>
												</div>
												<div className='col-12'>
													<Button
														icon='close'
														color='danger'
														className='w-100 p-3'
														isLight={TABS.RESIGNATION !== activeTab}
														onClick={() =>
															setActiveTab(TABS.RESIGNATION)
														}>
														{TABS.RESIGNATION}
													</Button>
												</div>
												<div className='col-12'>
													<Button
														icon='AttachMoney'
														color='warning'
														className='w-100 p-3'
														isLight={TABS.PAYSTUB !== activeTab}
														onClick={() => setActiveTab(TABS.PAYSTUB)}>
														{TABS.PAYSTUB}
													</Button>
												</div>
												<div className='col-12'>
													<Button
														icon='LocationOn'
														color='secondary'
														className='w-100 p-3'
														isLight={TABS.POINT !== activeTab}
														onClick={() => setActiveTab(TABS.POINT)}>
														{TABS.POINT}
													</Button>
												</div>
											</div>
										</CardBody>
									</Card>
									{/* TABS */}
									<Card stretch className='col-7	'>
										<CardBody isScrollable>
											{TABS.COLLABORATOR === activeTab && (
												<DossieDocument collaborator={collaborator} />
											)}
											{TABS.ADMISSION === activeTab && (
												<DossieAdmission job={job} />
											)}
											{TABS.PAYSTUB === activeTab && <DossiePayStub />}
											{TABS.POINT === activeTab && <DossiePoint />}
											{TABS.RESIGNATION === activeTab && (
												<DossieResignation />
											)}
										</CardBody>
									</Card>
								</CardBody>
							</Card>
							{/* <Card>
								<CardHeader>
									<CardLabel icon='Task' iconColor='danger'>
										<CardTitle>
											<CardLabel tag='div' className='h5'>
												Assigned
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='table-responsive'>
										<table className='table table-modern mb-0'>
											<thead>
												<tr>
													<th>Date / Time</th>
													<th>Customer</th>
													<th>Service</th>
													<th>Duration</th>
													<th>Payment</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{userTasks.map((item) => (
													<tr key={item.id}>
														<td>
															<div className='d-flex align-items-center'>
																<span
																	className={classNames(
																		'badge',
																		'border border-2 border-light',
																		'rounded-circle',
																		'bg-success',
																		'p-2 me-2',
																		`bg-${item.status.color}`,
																	)}>
																	<span className='visually-hidden'>
																		{item.status.name}
																	</span>
																</span>
																<span className='text-nowrap'>
																	{dayjs(
																		`${item.date} ${item.time}`,
																	).format('MMM Do YYYY, h:mm a')}
																</span>
															</div>
														</td>
														<td>
															<div>
																<div>{item.customer.name}</div>
																<div className='small text-muted'>
																	{item.customer.email}
																</div>
															</div>
														</td>
														<td>{item.service.name}</td>
														<td>{item.duration}</td>
														<td>
															{item.payment &&
																priceFormat(item.payment)}
														</td>
														<td>
															<Dropdown>
																<DropdownToggle hasIcon={false}>
																	<Button
																		isLink
																		color={item.status.color}
																		icon='Circle'
																		className='text-nowrap'>
																		{item.status.name}
																	</Button>
																</DropdownToggle>
																<DropdownMenu>
																	{Object.keys(EVENT_STATUS).map(
																		(key) => (
																			<DropdownItem key={key}>
																				<div>
																					<Icon
																						icon='Circle'
																						color={
																							EVENT_STATUS[
																								key
																							].color
																						}
																					/>
																					{
																						EVENT_STATUS[
																							key
																						].name
																					}
																				</div>
																			</DropdownItem>
																		),
																	)}
																</DropdownMenu>
															</Dropdown>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
									{!userTasks.length && (
										<Alert
											color='warning'
											isLight
											icon='Report'
											className='mt-3'>
											There is no scheduled and assigned task.
										</Alert>
									)}
								</CardBody>
							</Card> */}
						</div>
					</div>
				</Page>
			) : (
				<Page>
					<div className='w-100 h-100 d-flex align-items-center justify-content-center'>
						<Spinner />
					</div>
				</Page>
			)}
		</PageWrapper>
	);
};

export default CollaboratorProfilePage;
