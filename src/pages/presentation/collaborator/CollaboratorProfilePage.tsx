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
import { demoPagesMenu } from '../../../menu';
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
const CollaboratorProfilePage = () => {
	useTourStep(19);

	const { darkModeStatus } = useDarkMode();
	const { cpf } = useParams();
	const [collaborator, setCollaborator] = useState<any>(null);
	const [picture, setPicture] = useState<any>(null);
	const [job, setJob] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (cpf) {
				const response = await Collaborator(cpf);
				if (response.status == 200) {
					setCollaborator(response.collaborator);
					setPicture(response.picture);

					const responseJob = await Job_One(response.collaborator.id_work);
					if (responseJob.status == 200) {
						console.log(responseJob.job);
						console.log('time:', responseJob.job.time.time);
						setJob(responseJob.job);
					}
				}
			}
		};
		fetchData();
	}, [cpf]);

	const [dayHours] = useState<IChartOptions>({
		series: [
			{
				data: [8, 12, 15, 20, 15, 22, 9],
			},
		],
		options: {
			colors: [process.env.REACT_APP_SUCCESS_COLOR],
			chart: {
				type: 'radar',
				width: 200,
				height: 200,
				sparkline: {
					enabled: true,
				},
			},
			xaxis: {
				categories: [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday',
				],
				// convertedCatToNumeric: false,
			},
			tooltip: {
				theme: 'dark',
				fixed: {
					enabled: false,
				},
				x: {
					show: true,
				},
				y: {
					title: {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						formatter(seriesName) {
							return 'Hours';
						},
					},
				},
			},
			stroke: {
				curve: 'smooth',
				width: 2,
			},
			plotOptions: {
				radar: {
					polygons: {
						strokeColors: `${COLORS.SUCCESS.code}50`,
						strokeWidth: '1',
						connectorColors: `${COLORS.SUCCESS.code}50`,
					},
				},
			},
		},
	});

	const userTasks = dummyEventsData.filter((f) => f.assigned.username === 'CPF.username');

	return (
		<PageWrapper title={`nome username`}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='info'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`../${demoPagesMenu.appointment.subMenu.employeeList.path}`}>
						Back to List
					</Button>
					<SubheaderSeparator />
					<CommonAvatarTeam isAlignmentEnd>
						<strong>Sports</strong> Team
					</CommonAvatarTeam>
				</SubHeaderLeft>
				<SubHeaderRight>
					<span className='text-muted fst-italic me-2'>Last update:</span>
					<span className='fw-bold'>13 hours ago</span>
				</SubHeaderRight>
			</SubHeader>
			{1 > 0 ? (
				<Page>
					<div className='pt-3 pb-5 d-flex align-items-center justify-content-between'>
						<span className='display-4 fw-bold me-3'>
							{collaborator && collaborator.name}
						</span>
						{/* <span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
							{'data posição'}
						</span> */}
						<span>
							<Button
								icon='DoorFront'
								color='danger'
								isOutline={true}
								size={'lg'}
							>Desligar</Button>
							{/* <Icon icon='DoorFront' color='danger' size={'3x'}/> */}
						</span>
					</div>
					<div className='row'>
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
							<Card>
								<CardHeader>
									<CardLabel icon='ShowChart' iconColor='secondary'>
										<CardTitle tag='div' className='h5'>
											Statics
										</CardTitle>
									</CardLabel>
									<CardActions>
										Only in <strong>{dayjs().format('MMM')}</strong>.
									</CardActions>
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
													<div className='fw-bold fs-3 mb-0'>15</div>
													<div className='text-muted mt-n2 truncate-line-1'>
														Completed tasks
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
													<div className='fw-bold fs-3 mb-0'>1,280</div>
													<div className='text-muted mt-n2 truncate-line-1'>
														Earning
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
														icon='Celebration'
														size='3x'
														color='primary'
													/>
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>76</div>
													<div className='text-muted mt-n2 truncate-line-1'>
														Occupancy
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
													<Icon icon='Timer' size='3x' color='success' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>42</div>
													<div className='text-muted mt-n2'>Hours</div>
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
									<CardActions>
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
									</CardActions>
								</CardHeader>
								<CardBody>
									<div className='row g-4'>
										<div className='col-md-6'>
											<Card
												className={`bg-l${
													darkModeStatus ? 'o25' : '25'
												}-primary bg-l${
													darkModeStatus ? 'o50' : '10'
												}-primary-hover transition-base rounded-2 mb-4`}
												shadow='sm'>
												<CardHeader className='bg-transparent'>
													<CardLabel>
														<CardTitle tag='div' className='h5'>
															Customer Happiness
														</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody>
													<div className='d-flex align-items-center pb-3'>
														<div className='flex-shrink-0'>
															<Icon
																icon='EmojiEmotions'
																size='4x'
																color='primary'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-3 mb-0'>
																100%
																<span className='text-info fs-5 fw-bold ms-3'>
																	0
																	<Icon icon='TrendingFlat' />
																</span>
															</div>
															<div className='text-muted'>
																Compared to ($5000 last year)
															</div>
														</div>
													</div>
												</CardBody>
											</Card>
											<Card
												className={`bg-l${
													darkModeStatus ? 'o25' : '25'
												}-danger bg-l${
													darkModeStatus ? 'o50' : '10'
												}-danger-hover transition-base rounded-2 mb-0`}
												shadow='sm'>
												<CardHeader className='bg-transparent'>
													<CardLabel>
														<CardTitle tag='div' className='h5'>
															Injury
														</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody>
													<div className='d-flex align-items-center pb-3'>
														<div className='flex-shrink-0'>
															<Icon
																icon='Healing'
																size='4x'
																color='danger'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-3 mb-0'>
																1
																<span className='text-danger fs-5 fw-bold ms-3'>
																	-50%
																	<Icon icon='TrendingDown' />
																</span>
															</div>
															<div className='text-muted'>
																Compared to (2 last week)
															</div>
														</div>
													</div>
												</CardBody>
											</Card>
										</div>
										<div className='col-md-6'>
											<Card
												className={`bg-l${
													darkModeStatus ? 'o25' : '25'
												}-success bg-l${
													darkModeStatus ? 'o50' : '10'
												}-success-hover transition-base rounded-2 mb-0`}
												stretch
												shadow='sm'>
												<CardHeader className='bg-transparent'>
													<CardLabel>
														<CardTitle tag='div' className='h5'>
															Daily Occupancy
														</CardTitle>
													</CardLabel>
												</CardHeader>
												<CardBody className='pt-0'>
													<Chart
														className='d-flex justify-content-center'
														series={dayHours.series}
														options={dayHours.options}
														type={dayHours.options.chart?.type}
														height={dayHours.options.chart?.height}
														width={dayHours.options.chart?.width}
													/>
													<div className='d-flex align-items-center pb-3'>
														<div className='flex-shrink-0'>
															<Icon
																icon='Timer'
																size='4x'
																color='success'
															/>
														</div>
														<div className='flex-grow-1 ms-3'>
															<div className='fw-bold fs-3 mb-0'>
																~22H
																<span className='text-success fs-5 fw-bold ms-3'>
																	+12.5%
																	<Icon icon='TrendingUp' />
																</span>
															</div>
															<div className='text-muted'>
																Compared to (~19H 30M last week)
															</div>
														</div>
													</div>
												</CardBody>
											</Card>
										</div>
									</div>
								</CardBody>
							</Card>
							<Card>
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
							</Card>
						</div>
					</div>
				</Page>
			) : (
				<Page>
					<>aqui</>
				</Page>
			)}
		</PageWrapper>
	);
};

export default CollaboratorProfilePage;
