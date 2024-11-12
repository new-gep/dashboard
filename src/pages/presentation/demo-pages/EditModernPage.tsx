import React, { useContext, useEffect, useState } from 'react';
import { useFormik, Form } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPagesMenu } from '../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import validate from './helper/editPagesValidate';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import useDarkMode from '../../../hooks/useDarkMode';
import Spinner from '../../../components/bootstrap/Spinner';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import { AvatarPicture } from '../../../constants/avatar';
import CommonDesc from '../../../common/other/CommonDesc';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import AuthContext from '../../../contexts/authContext';
import Mask from '../../../function/Mask';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { color } from 'framer-motion';
import User from '../../../api/patch/User';
const EditModernPage = () => {
	const { themeStatus } = useDarkMode();
	const { userData, setUserData, setToken } = useContext(AuthContext);
	/**
	 * Common
	 */
	const [lastSave, setLastSave] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [modalAvatar, setModalAvatar] = useState<boolean>(false);
	const [passwordChangeCTA, setPasswordChangeCTA] = useState<boolean>(false);
	const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

	const handleAvatarClick = (key: string) => {
		setSelectedAvatar(key);
		formik.setFieldValue('avatar', key);
	};

	const handleSave = async (picture?:boolean) => {
		try{
			if (picture) {
				setUserData((prevUserData:any) => ({
					...prevUserData,   
					avatar: selectedAvatar   
				}));
			};
			setModalAvatar(false)
			setIsLoading(false);
			const response = await User(userData.id, formik.values)
			switch (response.status) {
				case 200:
					setPasswordChangeCTA(false)
					setToken(response.token)
					setUserData((prevUserData:any) => ({
						...prevUserData,   
						lastUpdate: response.update_at   
					}));
					setLastSave(true)
					localStorage.setItem('gep_authToken', response.token);
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Info' size='lg' className='me-1' />
							<span>Sucesso</span>
						</span>,
						"Os detalhes da conta foram atualizados com sucesso.",
					);
				return;
				default:
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Info' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						"Os detalhes da conta não foram atualizados.",
					);
				break;
			}

		}catch(e){
			console.log(e)
		}
	};

	const cancelEditPassword = async () => {
		setPasswordChangeCTA(false)
		formik.setFieldValue('currentPassword', '');
		formik.setFieldValue('newPassword', '');
		formik.setFieldValue('confirmPassword', '');
		return
	};

	interface IValues {
		firstName :string;
		lastName  : string;
		name  : string;
		email : string;
		phone : string;
		currentPassword: string
		newPassword: string;
		confirmPassword : string;
		checkOne : boolean;
		checkTwo : boolean;
		checkThree : boolean;
		avatar : any;
	};

	const validate = (values: IValues) => {
		const errors: any = {};
		// Campos obrigatórios
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^(\d{2})(\d{9})$/;
		if (!values.firstName) {
			errors.firstName = 'Nome é obrigatório';
		}
		if (!values.lastName) {
			errors.lastName = 'Sobrenome é obrigatório';
		}
		if (!values.name) {
			errors.name = 'Nome completo é obrigatório';
		}
		if (!values.phone) {
    		errors.phone = 'Telefone é obrigatório';
		} else if (!phoneRegex.test(Mask('remove', values.phone))) {
			errors.phone = 'Telefone inválido. Formato esperado: DDD seguido do número, ex: (11) 98765-4321';
		}

		if (!values.email) {
			errors.email = 'E-mail é obrigatório';
		} else if (!emailRegex.test(values.email)) {
			errors.email = 'E-mail inválido. Formato esperado: exemplo@dominio.com';
		}
		if (passwordChangeCTA) {
			// Validar senha atual
			if (!values.currentPassword) {
				errors.currentPassword = 'Senha atual é obrigatória';
			}
			
			// Validar nova senha
			if (!values.newPassword) {
				errors.newPassword = 'Nova senha é obrigatória';
			} else if (values.newPassword.length < 6) {
				errors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
			}
			
			// Validar confirmação da nova senha
			if (!values.confirmPassword) {
				errors.confirmPassword = 'Confirmação de senha é obrigatória';
			} else if (values.confirmPassword.length < 6) {
				errors.confirmPassword = 'Confirmação de senha deve ter pelo menos 6 caracteres';
			}
			
			// Verificar se nova senha e confirmação são iguais
			if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
				errors.confirmPassword = 'As senhas não correspondem';
			}
		};
	
		// Não validamos os campos opcionais (benefits, details, obligations)
	
		return errors;
	};

	const formik = useFormik({
		initialValues: {
			firstName: '',
			lastName: '',
			name: '',
			email: '',
			phone: '',
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
			checkOne: true,
			checkTwo: false,
			checkThree: true,
			avatar: null
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			handleSave()
		},
	});

	useEffect(() => {
		if (userData) {
			formik.setValues({
				avatar: userData.avatar && userData.avatar,
				firstName: userData.name && Mask('firstName', userData.name),
				lastName : userData.name && Mask('secondName', userData.name),
				name: userData.name || '',
				email: userData.email || '',
				phone: userData.phone,
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
				checkOne: true,
				checkTwo: false,
				checkThree: true,
			} as any);
		}
	}, [userData]);

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editModern.text}>
			<Modal isOpen={modalAvatar} setIsOpen={setModalAvatar}>
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
					<Button type='submit' icon='Save' className='btn btn-info' onClick={()=>handleSave(true)}>Salvar</Button>
				</ModalFooter>
			</Modal>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Perfil', to: '/' },
							{ title: 'Editar Usuário', to: '/' },
						]}
					/>
					<SubheaderSeparator />
					<span className='text-muted text-capitalize'>{userData && userData.name} </span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						type='submit'
						icon={isLoading ? undefined : 'Save'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Salvando') || 'Atualizando'
							: (lastSave && 'Atualizado') || 'Salvar'}
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100 align-content-start'>
					<div className='col-md-8'>
						<Card>
							<CardBody>
								<div className='col-12'>
									<div className='row g-4 align-items-center'>
										<div className='col-lg-auto'>
											<Avatar
												src={
													selectedAvatar 
													//@ts-ignore
													  ? AvatarPicture[selectedAvatar]                // Se o usuário selecionou um avatar, exiba-o
													  : userData.avatar 
													  // @ts-ignore
													  ? AvatarPicture[userData.avatar]                           // Caso contrário, exiba o avatar do usuário (se disponível)
													  : AvatarPicture.default                       // Caso contrário, exiba o avatar padrão
												  }
												color='storybook'
												rounded={3}
											/>
										</div>
										<div className='col-lg'>
											<div className='row g-4'>
												<div className='col-auto'>
													<Input
														type='file'
														autoComplete='photo'
														ariaLabel='Upload image file'
														disabled={true}
													/>
												</div>
												<div className='col-auto'>
													<Button color='dark' isLight icon='Sync'
														onClick={()=>setModalAvatar(true)}
													>
														Alterar Avatar
													</Button>
												</div>
												<div className='col-auto'>
													<Button color='dark' isLight icon='Delete' isDisable>
														Deletar Avatar
													</Button>
												</div>
												<div className='col-12'>
													<p className='lead text-muted'>
														Atualmente não é possível colocar sua foto, apenas avatares. 
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='Person' iconColor='success'>
									<CardTitle tag='div' className='h5'>
										Informação Pessoal
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										Credenciais do usuário
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-6'>
										<FormGroup id='firstName' label='Primeiro Nome' isFloating>
											<Input
												className='text-capitalize'
												placeholder='Primeiro Nome'
												autoComplete='additional-name'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.firstName}
												isValid={formik.isValid}
												isTouched={formik.touched.firstName}
												invalidFeedback={formik.errors.firstName}
												validFeedback='Ótimo'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup id='lastName' label='Último Nome' isFloating>
											<Input
												className='text-capitalize'
												placeholder='Último Nome'
												autoComplete='family-name'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.lastName}
												isValid={formik.isValid}
												isTouched={formik.touched.lastName}
												invalidFeedback={formik.errors.lastName}
												validFeedback='Ótimo'
											/>
										</FormGroup>
									</div>
									<div className='col-12'>
										<FormGroup
											id='name'
											label='Nome Completo'
											isFloating
											formText='Será assim que seu nome será exibido na seção da conta e nas avaliações'>
											<Input
												className='text-capitalize'
												placeholder='Display Name'
												autoComplete='username'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={`${formik.values.firstName} ${formik.values.lastName}`}
												isValid={formik.isValid}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
												validFeedback='Ótimo'
												disabled={true}
											/>
										</FormGroup>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='Phonelink' iconColor='danger'>
									<CardTitle tag='div' className='h5'>
										Informações de Contato
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										Informações de contato do usuário
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-6'>
										<FormGroup
											id='email'
											label='Email'
											isFloating>
											<Input
												type='email'
												placeholder='Email'
												autoComplete='email'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.email}
												isValid={formik.isValid}
												isTouched={formik.touched.email}
												invalidFeedback={formik.errors.email}
												validFeedback='Ótimo'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup id='phone' label='Celular' isFloating>
											<Input
												type='tel'
												placeholder='Celular'
												autoComplete='tel'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={Mask('phone', formik.values.phone)}
												isValid={formik.isValid}
												isTouched={formik.touched.phone}
												invalidFeedback={formik.errors.phone}
												validFeedback='Ótimo'
											/>
										</FormGroup>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='LocalPolice' iconColor='primary'>
									<CardTitle tag='div' className='h5'>
										Senha
									</CardTitle>
									<CardSubTitle tag='div' className='h6'>
										Operações de alteração de senha
									</CardSubTitle>
								</CardLabel>
								<CardActions>
									{passwordChangeCTA ? (
										<Button
											color='danger'
											isLight
											icon='Cancel'
											onClick={() => cancelEditPassword()}>
											Cancelar
										</Button>
									) : (
										<>
											<span>Você quer mudar?</span>
											<Button
												color='primary'
												isLight
												icon='PublishedWithChanges'
												onClick={() => setPasswordChangeCTA(true)}>
												Sim
											</Button>
										</>
									)}
								</CardActions>
							</CardHeader>
							{passwordChangeCTA && (
								<CardBody>
									<div className='row g-4'>
										<div className='col-12'>
											<FormGroup
												id='currentPassword'
												label='Senha Atual'
												isFloating>
												<Input
													type='password'
													placeholder='Senha Atual'
													autoComplete='current-password'
													onChange={formik.handleChange}
													isValid={formik.isValid}
													value={formik.values.currentPassword}
													isTouched={formik.touched.currentPassword}
													invalidFeedback={formik.errors.currentPassword}
													onBlur={formik.handleBlur}
													validFeedback='Ótimo'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup
												id='newPassword'
												label='Nova Senha'
												isFloating>
												<Input
													type='password'
													placeholder='Nova Senha'
													autoComplete='new-password'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.newPassword}
													isValid={formik.isValid}
													isTouched={formik.touched.newPassword}
													invalidFeedback={formik.errors.newPassword}
													validFeedback='Ótimo'
												/>
											</FormGroup>
										</div>
										<div className='col-12'>
											<FormGroup
												id='confirmPassword'
												label='Confirma Nova Senha'
												isFloating>
												<Input
													type='password'
													placeholder='Confirm new password'
													autoComplete='new-password'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.confirmPassword}
													isValid={formik.isValid}
													isTouched={formik.touched.confirmPassword}
													invalidFeedback={formik.errors.confirmPassword}
													validFeedback='Ótimo'
												/>
											</FormGroup>
										</div>
									</div>{' '}
								</CardBody>
							)}
							<CardFooter>
								<CommonDesc>
									Para sua segurança, recomendamos que você altere sua senha a cada 3 meses, no máximo.
								</CommonDesc>
							</CardFooter>
						</Card>
					</div>
					<div className='col-md-4'>
						<Card className='position-sticky sticky-top-size'>
							<CardHeader>
								<CardLabel icon='MarkEmailUnread'>
									<CardTitle tag='div' className='h5'>
										Notificação por e-mail
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-12'>
										<FormGroup>
											{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
											<Label>
												Escolha quais mensagens você gostaria de receber por e-mail.
											</Label>
											<ChecksGroup>
												<Checks
													type='switch'
													id='inlineCheckOne'
													label='Receber novidades'
													name='checkOne'
													onChange={formik.handleChange}
													checked={formik.values.checkOne}
												/>
												{/* <Checks
													type='switch'
													id='inlineCheckTwo'
													label='Payouts'
													name='checkTwo'
													onChange={formik.handleChange}
													checked={formik.values.checkTwo}
												/>
												<Checks
													type='switch'
													id='inlineCheckThree'
													label='Application fees'
													name='checkThree'
													onChange={formik.handleChange}
													checked={formik.values.checkThree}
												/> */}
											</ChecksGroup>
										</FormGroup>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardBody>
								<div className='row align-items-center'>
									<div className='col'>
										{lastSave ? (
											<>
												<Icon
													icon='DoneAll'
													size='lg'
													className='me-2 text-muted'
												/>
												<span className='me-2 text-muted'>Atualizado</span>
												<strong>
													{userData.lastUpdate && Mask('lastUpdate', userData.lastUpdate)}
												</strong>
											</>
										) : (
											<>
												<Icon
													icon='Warning'
													size='lg'
													className='me-2'
												/>
												<span className=''>Ainda não salvo</span>
											</>
										)}
									</div>
									<div className='col-auto'>
										<div className='row g-1'>
											<div className='col-auto'>
												<Button
													className='me-3'
													icon={isLoading ? undefined : 'Save'}
													isLight
													color={lastSave ? 'info' : 'success'}
													isDisable={isLoading}
													onClick={formik.handleSubmit}>
													{isLoading && <Spinner isSmall inButton />}
													{isLoading
														? (lastSave && 'Saving') || 'Publishing'
														: (lastSave && 'Save') || 'Salvar'}
												</Button>
											</div>
											<div className='col-auto'>
												<Dropdown direction='up'>
													<DropdownToggle hasIcon={false}>
														<Button
															color={themeStatus}
															icon='MoreVert'
															aria-label='More'
														/>
													</DropdownToggle>
													<DropdownMenu isAlignmentEnd>
														<DropdownItem>
															<Button
																className='me-3'
																icon='Save'
																isLight
																isDisable={isLoading}
																onClick={formik.resetForm}>
																Resetar
															</Button>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</div>
										</div>
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

export default EditModernPage;
