import classNames from 'classnames';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import { useContext, useEffect, useState } from 'react';
import UserAllByCNPJ from '../../../api/get/user/AllByCNPJ';
import AuthContext from '../../../contexts/authContext';
import { AvatarPicture } from '../../../constants/avatar';
import Avatar from '../../../components/Avatar';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import CreateUser from '../../../api/post/user/Create';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';

const validate = (values: {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	avatar: string;
	user: string;
	phone: string;
}) => {
	const errors: any = {};

	if (!values.name) {
		errors.name = 'Nome é obrigatório';
	} else if (values.name.length < 3) {
		errors.name = 'Nome deve ter pelo menos 3 caracteres';
	}

	if (!values.email) {
		errors.email = 'Email é obrigatório';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
		errors.email = 'Email inválido';
	}

	if (!values.phone) {
		errors.phone = 'Celular é obrigatório';
	} else if (values.phone.replace(/\D/g, '').length !== 11) {
		errors.phone = 'Celular deve ter 11 dígitos numéricos';
	}

	if (!values.user) {
		errors.user = 'Usuário é obrigatório';
	} else if (values.user.length < 5) {
		errors.user = 'Usuário deve ter pelo menos 5 caracteres';
	}

	if (!values.password) {
		errors.password = 'Senha é obrigatória';
	} else if (values.password.length < 6) {
		errors.password = 'Senha deve ter pelo menos 6 caracteres';
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = 'Confirmar Senha é obrigatório';
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = 'As senhas não conferem';
	}

	if (!values.avatar) {
		errors.avatar = 'Avatar é obrigatório';
	}
	
	console.log(errors);

	return errors;
};

const CompanyUser = () => {
	const { userData } = useContext(AuthContext);
	const [users, setUsers] = useState<any[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [modalAvatar, setModalAvatar] = useState<boolean>(false);
	const [selectedAvatar, setSelectedAvatar] = useState<string>('');

	const formik = useFormik({
		initialValues: {
			name: '',
			avatar: 'avatar1',
			user:'',
			email: '',
			phone: '',
			password: '',
			confirmPassword: '',
		},
		validate,
		onSubmit: (values) => {
			if(isEditMode){
				editUser(values);
			}else{
				saveUser(values);
			}
		},
	});

	const saveUser = async (values: any) => {
		let phone = values.phone.replace(/\D/g, '');
		const propsUser = {
			hierarchy: '1',
			CNPJ_company: userData.cnpj,
			name: values.name,
			avatar: values.avatar,
			user: values.user,
			email: values.email,
			phone: phone,
			password: values.password,
		}
		const response = await CreateUser(propsUser);
		console.log(response);
		if(response.status === 201){
			setUsers([...users, response.user]);
			toast(
				<Toasts icon={'Check'} iconColor={'success'} title={'Parabéns!'}>
					Usuário criado com sucesso.
				</Toasts>,
			);
			setIsModalOpen(false);
			formik.resetForm();
		}else if(response.status === 409){
			toast(
				<Toasts icon={'Warning'} iconColor={'warning'} title={'Erro'}>
					Erro ao criar usuário, <span className='fw-bold text-warning'>{response.message}</span>
				</Toasts>,
			);
		}else{
			toast(
				<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
					Erro ao criar usuário, tente novamente.
				</Toasts>,
			);
		}
	}

	const editUser = async (values: any) => {
		console.log(values);
	};

	const openModal = (user: any = null) => {
		if (user) {
			setIsEditMode(true);
			setCurrentUser(user);
			formik.setValues({
				name: user.name,
				avatar: user.avatar,
				user: user.user,
				email: user.email,
				phone: user.phone,
				password: '',
				confirmPassword: '',
			});
		} else {
			setIsEditMode(false);
			setCurrentUser(null);
			formik.resetForm();
		}
		setIsModalOpen(true);
	};

	const handleAvatarClick = (key: string) => {
		setSelectedAvatar(key);
		formik.setFieldValue('avatar', key);
	};

	useEffect(() => {
		if (userData) {
			console.log(userData);
			const fechData = async () => {
				const data = await UserAllByCNPJ(userData.cnpj);
				if (data.status === 200) {
					setUsers(data.users);
				}
			};
			fechData();
		}
	}, [userData]);

	return (
		<section >
			<Card stretch>
				<CardHeader>
					<CardLabel icon='Person' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							Usuários
						</CardTitle>
					</CardLabel>
					<CardActions>
						{
							userData && userData.hierarchy == '0' &&
							<Button color='info' icon='PersonAdd' isLight onClick={() => openModal()}>
								Adicionar Usuário
							</Button>
						}
					</CardActions>
				</CardHeader>

				<CardBody>
					<section className='flex'>
						{users && users.length > 0 && 
							users && users.length > 0 ? (
								users.map((user) => {
									if(user.hierarchy !== '0'){
										return
									}
									return (
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
																			'bg-primary',
																			'rounded-2',
																			'd-flex align-items-center justify-content-center',
																			'overflow-hidden',
																			'shadow',
																		)}>
																		<Avatar
																			// @ts-ignore
																			src={AvatarPicture[user.avatar]}
																			color='storybook'
																			rounded={3}
																		/>
																	</div>
																</div>

																{/* saber se está on ou off */}
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
																			<div className='fw-bold fs-5 me-2 text-capitalize'>
																				{user.name}
																			</div>

																			<small
																				className={`border ${'border-success text-success'} border-2 fw-bold px-2 py-1 rounded-1`}>
																				Administrador Chefe
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
																			onClick={() => openModal(user)}
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
									);
								})
							) : (
								<p>Nenhum Administrador Chefe</p>
							)
						}

						<section className='row gap-5 flex justify-content-center' style={{ maxHeight: '400px', overflowY: 'auto' }}>
							{users && users.length > 1 ? (
								users.map((user) => {
									if(user.hierarchy === '0'){
										return
									}
									return (
										<Card className='col-12 col-md-5 col-lg-5'>	
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
																		<Avatar
																			// @ts-ignore
																			src={AvatarPicture[user.avatar]}
																			color='storybook'
																			rounded={3}
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
																			onClick={() => openModal(user)}
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
									);
								})
							) : (
								<div className='d-flex flex-column justify-content-center align-items-center mt-5'>
									<h2>Nenhum Usuário Cadastrado</h2>
									<p className='text-muted'>
										Adicione um usuário para começar a usar o sistema
									</p>
									<Button color='light' icon='PersonAdd' className='circle' size='lg' isLink onClick={() => openModal()}>
									</Button>
								</div>
							)}
						</section>
					</section>
				</CardBody>
			</Card>

			<Modal isStaticBackdrop={true}  isOpen={isModalOpen} setIsOpen={setIsModalOpen} size='lg' isCentered>
				{/* Selection Avatar */}
				<Modal  isOpen={modalAvatar} setIsOpen={setModalAvatar} >
					<ModalHeader >
						<ModalTitle id={ 'teste' }>
							<h5>Escolha seu Avatar</h5>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className="d-flex align-items-center flex-wrap p-2 gap-4 ">
							{Object.keys(AvatarPicture)
							.filter((key) => key !== 'default')
							.map((key, index) => (
								<img
									height={70}
									width={70}
									key={index}
									//@ts-ignore
									src={AvatarPicture[key]} // Supondo que cada avatar tenha uma propriedade `src`
									alt={'Avatar do Usuário'} // Supondo que cada avatar tenha uma propriedade `alt`
									onClick={() => handleAvatarClick(key)}
									className={`border-hover cursor-pointer ${selectedAvatar === key && 'rounded-1 bg-primary' }`}
								/>
							))}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button className='btn btn-outline-info border-0' onClick={()=>setModalAvatar(false)}>
							Fechar
						</Button>
					</ModalFooter>
				</Modal>
				
				<ModalHeader setIsOpen={setIsModalOpen}>
					<ModalTitle id='modal-title'>{isEditMode ? (currentUser && currentUser.hierarchy !== '0' && userData.hierarchy === '0' ? 'Editar Usuário' : 'Visualizar Usuário') : '+ Novo Usuário'}</ModalTitle>
				</ModalHeader>


				<ModalBody>
					<div className='d-flex  justify-content-center item-center'>
						<div className='d-flex flex-column gap-1 align-items-center'>
							<div>
								<Avatar
									//@ts-ignore
									src={formik.values.avatar ? AvatarPicture[formik.values.avatar] : AvatarPicture[userData.avatar]}
									color='storybook'
									rounded={3}
									size={150}
									className='bg-primary'
								/>
							</div>
							{ 
								((currentUser && currentUser.hierarchy !== '0' && userData.hierarchy === '0') || !currentUser) &&
								<div>
								<Button color='light' isLink icon='Sync'
									onClick={()=>{setModalAvatar(true)}}
								>
									Alterar Avatar
								</Button>
								</div>
							}
						</div>
					</div>

					<form onSubmit={formik.handleSubmit}>
						<section className='row d-flex g-4'>
							<FormGroup className='col-12' id='name' label='Nome Completo'>
								<Input 
									className='text-capitalize'
									onChange={formik.handleChange}
									value={formik.values.name}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.name}
									invalidFeedback={formik.errors.name}
									validFeedback='Ótimo!'
									disabled={currentUser && currentUser.hierarchy === '0' && (userData.hierarchy !== '0' || currentUser.id === userData.id)}
								/>
							</FormGroup>
							<FormGroup className='col-6' id='email' label='Email'>
								<Input 
									onChange={formik.handleChange}
									value={formik.values.email}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.email}
									invalidFeedback={formik.errors.email}
									validFeedback='Ótimo!'
									disabled={currentUser && currentUser.hierarchy === '0' && (userData.hierarchy !== '0' || currentUser.id === userData.id)}
								/>	
							</FormGroup>
							<FormGroup className='col-6' id='phone' label='Celular'>
								<Input 
									onChange={formik.handleChange}
									value={formik.values.phone}
									onBlur={formik.handleBlur}
									mask='(99) 99999-9999'
									isValid={formik.isValid}
									isTouched={formik.touched.phone}
									invalidFeedback={formik.errors.phone}
									validFeedback='Ótimo!'
									disabled={currentUser && currentUser.hierarchy === '0' && (userData.hierarchy !== '0' || currentUser.id === userData.id)}
								/>
							</FormGroup>
							{ 
								((currentUser && currentUser.hierarchy !== '0' && userData.hierarchy === '0') || !currentUser) &&
								<>
									<FormGroup className='col-12' id='user' label='Usuário'>
										<Input 
											onChange={formik.handleChange}
											value={formik.values.user}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.user}
											invalidFeedback={formik.errors.user}
											validFeedback='Ótimo!'
											
										/>
									</FormGroup>
									<FormGroup className='col-6' id='password' label='Senha'>
										<Input 
											onChange={formik.handleChange}
											value={formik.values.password}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.password}
											invalidFeedback={formik.errors.password}
											validFeedback='Ótimo!'
											
										/>
									</FormGroup>
									<FormGroup className='col-6' id='confirmPassword' label='Confirmar Senha'>
										<Input 
											onChange={formik.handleChange}
											value={formik.values.confirmPassword}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.confirmPassword}
											invalidFeedback={formik.errors.confirmPassword}
											validFeedback='Ótimo!'
											
										/>
									</FormGroup>
								</>
							}
						</section>
							{  ((currentUser && currentUser.hierarchy !== '0' && userData.hierarchy === '0') || !currentUser) &&
								<ModalFooter className='mt-2'>
										<Button color='success' isLight  icon='Save'
										type='submit'
									>
										Salvar
									</Button>
								</ModalFooter>
							}
					</form>
				</ModalBody>

			</Modal>
		</section>
	);
};

export default CompanyUser;
