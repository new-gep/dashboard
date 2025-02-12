import classNames from 'classnames';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

const CompanyUser = () => {
	return (
		<section>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='Person' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							Usuários
						</CardTitle>
					</CardLabel>
					<CardActions>
						<Button color='info' icon='PersonAdd' isLight onClick={() => {}}>
							Adicionar Usuário
						</Button>
					</CardActions>
				</CardHeader>

				<CardBody>
					<section className='flex'>
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
															// `bg-l25-${user.color}`,
															'rounded-2',
															'd-flex align-items-center justify-content-center',
															'overflow-hidden',
															'shadow',
														)}>
														<img
															// src={job.picture}
															// alt={job.collaborator.name}
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
																{/* {Mask(
																	'firstName',
																	job.collaborator.name,
																)}{' '}
																{Mask(
																	'secondName',
																	job.collaborator.name,
																)} */}
															</div>

															<small
																className={`border ${true ? 'border-danger text-danger' : 'border-success text-success'} border-2 fw-bold px-2 py-1 rounded-1`}>
																{true
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
															// to={`../collaborator/profile/${job.collaborator.CPF}`}
															// data-tour={user.name}
															aria-label='More info'
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<p>aqui</p>
					</section>
				</CardBody>
			</Card>
		</section>
	);
};

export default CompanyUser;
