import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import USERS from '../../../common/data/userDummyData';
import Button from '../../../components/bootstrap/Button';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SERVICES from '../../../common/data/serviceDummyData';
import { demoPagesMenu } from '../../../menu';
import useTourStep from '../../../hooks/useTourStep';
import JobCollaboratorCompany from '../../../api/get/job/Job_Collaborator_Company';
import AuthContext from '../../../contexts/authContext';
import Mask from '../../../function/Mask';

const CollaboratorList = () => {
	useTourStep(18);
	const { userData } = useContext(AuthContext);
	const [filterMenu, setFilterMenu] = useState(false);
	const [loader, setLoader] = useState<boolean>(true);
	const [collaboratorCompany, setCollaboratorCompany] = useState<any>(null);

	const formik = useFormik({
		initialValues: {
			available: false,
			searchInput: '',
			services: [],
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			setFilterMenu(false);
			// alert(JSON.stringify(values, null, 2));
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			const response = await JobCollaboratorCompany(userData.cnpj);
			if (!response || response.status !== 200) {
				setLoader(false);
				return;
			}
			setCollaboratorCompany(response.collaborator);
			setTimeout(() => {
				setLoader(false);
			}, 2000);
		};
		if (userData) {
			fetchData();
		}
	}, [userData]);

	return (
		<PageWrapper title={demoPagesMenu.appointment.subMenu.employeeList.text}>
			<SubHeader className='mt-3'>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Dropdown isOpen={filterMenu} setIsOpen={setFilterMenu}>
						<DropdownToggle hasIcon={false}>
							<Button icon='FilterAlt' color='primary' isLight aria-label='Filter' />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg' isCloseAfterLeave={false}>
							<div className='container py-2'>
								<form className='row g-3' onSubmit={formik.handleSubmit}>
									<div className='col-12'>
										<FormGroup>
											<Label htmlFor='available'>Available employee</Label>
											<Checks
												id='available'
												type='switch'
												label='Available'
												onChange={formik.handleChange}
												checked={formik.values.available}
												ariaLabel='Available status'
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup>
											<Label htmlFor='name'>Name</Label>
											<Input
												id='searchInput2'
												name='searchInput'
												ariaLabel='name'
												placeholder='Employee Name'
												list={[
													...Object.keys(USERS).map(
														(u) =>
															`${USERS[u].name} ${USERS[u].surname}`,
													),
												]}
												onChange={formik.handleChange}
												value={formik.values.searchInput}
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup>
											{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
											<Label>Services</Label>
											<ChecksGroup>
												{Object.keys(SERVICES).map((service) => (
													<Checks
														key={SERVICES[service].name}
														id={SERVICES[service].name}
														label={SERVICES[service].name}
														name='services'
														value={SERVICES[service].name}
														onChange={formik.handleChange}
														checked={formik.values.services.includes(
															// @ts-ignore
															SERVICES[service].name,
														)}
													/>
												))}
											</ChecksGroup>
										</FormGroup>
									</div>
									<div className='col-6'>
										<Button
											color='primary'
											isOutline
											className='w-100'
											onClick={formik.resetForm}>
											Reset
										</Button>
									</div>
									<div className='col-6'>
										<Button color='primary' className='w-100' type='submit'>
											Filter
										</Button>
									</div>
								</form>
							</div>
						</DropdownMenu>
					</Dropdown>
					<Button
						icon='PersonAdd'
						color='info'
						isLight
						tag='a'
						to={`../${demoPagesMenu.editPages.subMenu.editWizard.path}`}>
						New Employee
					</Button>
				</SubHeaderRight>
			</SubHeader>

			{loader ? (
				<div className='p-5'>
					<h1>🔍 Buscando Colaboradores</h1>
				</div>
			) : (
				<Page container='fluid'>
					<div className='row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2'>
						{/* {searchUsers.map((user) => (
							<div key={user.username} className='col'>
								<Card>
									<CardBody>
										<div className='row g-3'>
											<div className='col d-flex'>
												<div className='flex-shrink-0'>
													<div className='position-relative'>
														<div
															className='ratio ratio-1x1'
															style={{ width: 100 }}>
															<div
																className={classNames(
																	`bg-l25-${user.color}`,
																	'rounded-2',
																	'd-flex align-items-center justify-content-center',
																	'overflow-hidden',
																	'shadow',
																)}>
																<img
																	src={user.src}
																	alt={user.name}
																	width={100}
																/>
															</div>
														</div>
														{user.isOnline && (
															<span className='position-absolute top-100 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
																<span className='visually-hidden'>
																	Online user
																</span>
															</span>
														)}
													</div>
												</div>
												<div className='flex-grow-1 ms-3 d-flex justify-content-between'>
													<div className='w-100'>
														<div className='row'>
															<div className='col'>
																<div className='d-flex align-items-center'>
																	<div className='fw-bold fs-5 me-2'>
																		{`${user.name} ${user.surname}`}
																	</div>
																	<small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
																		{user.position}
																	</small>
																</div>

																<div className='text-muted'>
																	@{user.username}
																</div>
															</div>
															<div className='col-auto'>
																<Button
																	icon='Info'
																	color='dark'
																	isLight
																	hoverShadow='sm'
																	tag='a'
																	to={`../${demoPagesMenu.appointment.subMenu.employeeID.path}/${user.id}`}
																	data-tour={user.name}
																	aria-label='More info'
																/>
															</div>
														</div>
														{!!user?.services && (
															<div className='row g-2 mt-3'>
																{user?.services.map((service) => (
																	<div
																		key={service.name}
																		className='col-auto'>
																		<Badge
																			isLight
																			color={service.color}
																			className='px-3 py-2'>
																			<Icon
																				icon={service.icon}
																				size='lg'
																				className='me-1'
																			/>
																			{service.name}
																		</Badge>
																	</div>
																))}
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						))} */}
						{Array.isArray(collaboratorCompany) && collaboratorCompany.length > 0 ? (
							collaboratorCompany.map((job) => {
								console.log('teste', job);
								if (job.status != 200) {
									console.log('aquii', job);
									return;
								}
								return (
									<div key={job.collaborator.id} className='col'>
										<Card key={job.collaborator.id}>
											<CardBody key={job.collaborator.id}>
												<div className='row g-3'>
													<div className='col d-flex'>
														<div className='flex-shrink-0'>
															<div className='position-relative'>
																<div
																	className='ratio ratio-1x1'
																	style={{ width: 100 }}>
																	<div
																		className={classNames(
																			// `bg-l25-${user.color}`,
																			'rounded-2',
																			'd-flex align-items-center justify-content-center',
																			'overflow-hidden',
																			'shadow',
																		)}>
																		<img
																			src={job.picture}
																			alt={
																				job.collaborator
																					.name
																			}
																			width={100}
																		/>
																	</div>
																</div>
																{/* { (
																<span className='position-absolute top-100 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
																	<span className='visually-hidden'>
																		Online user
																	</span>
																</span>
															)} */}
															</div>
														</div>
														<div className='flex-grow-1 ms-3 d-flex justify-content-between'>
															<div className='w-100'>
																<div className='row'>
																	<div className='col'>
																		<div className='d-flex flex-column gap-3 align-items-start'>
																			<div className='fw-bold fs-5 me-2'>
																				{/* {`${user.name} ${user.surname}`} */}
																				{Mask(
																					'firstName',
																					job.collaborator
																						.name,
																				)}{' '}
																				{Mask(
																					'secondName',
																					job.collaborator
																						.name,
																				)}
																			</div>

																			<small
																				className={`border ${job.isDeleted ? 'border-danger text-danger' : 'border-success text-success'} border-2 fw-bold px-2 py-1 rounded-1`}>
																				{job.isDeleted
																					? 'Inativo'
																					: 'Ativo'}
																			</small>
																		</div>

																		<div className='text-muted'>
																			{/* @{job.function} */}
																		</div>
																	</div>
																	<div className='col-auto'>
																		<Button
																			icon='Info'
																			color='dark'
																			isLight
																			hoverShadow='sm'
																			tag='a'
																			to={`../collaborator/profile/${job.collaborator.CPF}`}
																			// data-tour={user.name}
																			aria-label='More info'
																		/>
																	</div>
																</div>
																{/* {!!user?.services && (
																<div className='row g-2 mt-3'>
																	{user?.services.map((service) => (
																		<div
																			key={service.name}
																			className='col-auto'>
																			<Badge
																				isLight
																				color={service.color}
																				className='px-3 py-2'>
																				<Icon
																					icon={service.icon}
																					size='lg'
																					className='me-1'
																				/>
																				{service.name}
																			</Badge>
																		</div>
																	))}
																</div>
															)} */}
															</div>
														</div>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								);
							})
						) : (
							<div className='p-5 w-full'>
								<h1>Nenhum colaborador encontrado</h1>
							</div>
						)}
					</div>
				</Page>
			)}
		</PageWrapper>
	);
};

export default CollaboratorList;
