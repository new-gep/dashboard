import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AuthSingUp from '../../../function/AuthSingUp';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert, { AlertHeading } from '../../../components/bootstrap/Alert';
import Logo from '../../../assets/logo/logo.png';
import LogoDark from '../../../assets/logo/logo_yellow.png';
import Icon from '../../../components/icon/Icon';
import Cnpj from '../../../api/get/Cnpj';
import Company from '../../../api/post/Company';
import User from '../../../api/get/user/SingIn';
import Mask from '../../../function/Mask';

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Criar uma Conta</div>
				<div className='text-center h4 text-muted mb-5'>Inscreva-se para começar!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Bem Vindo,</div>
			<div className='text-center h4 text-muted mb-5'>Acesse para continuar!</div>
		</>
	);
};
//@ts-ignore
LoginHeader.defaultProps = {
	isNewUser: false,
};

interface ILoginProps {
	isSignUp?: boolean;
}

interface SingUpProps {
	cnpj: string;
	municipal_registration: string;
	state_registration: string;
	email: string;
	name: string;
	phone: string;
	user: string;
	password: string;
	hasType: boolean;
}

interface SingInProps {
	email: string;
	password: string;
	name: string;
}

const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const { setToken } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const [isCardTypeAccountClient, setIsCardTypeAccountClient] = useState<boolean>(false);
	const [isCardTypeAccountCompany, setIsCardTypeAccountCompany] = useState<boolean>(false);
	const [isCompany, setIsCompany] = useState<boolean>(false);
	const [isClient, setIsClient] = useState<boolean>(false);
	const [isAccessInvalid, setIsAccessInvalid] = useState<boolean>(false);
	const [isRegisterInvalid, setIsRegisterInvalid] = useState<boolean>(false);
	const [textInvalid, setTextInvalid] = useState<string | false>(false);
	const [datesSingUp, setDatesSingUp] = useState<SingUpProps>({
		cnpj: '',
		name: '',
		email: '',
		phone: '',
		user: '',
		password: '',
		state_registration: '',
		municipal_registration: '',
		hasType: false,
	});
	const [datesSingIn, setDatesSingIn] = useState<SingInProps>({
		email: '',
		name: '',
		password: '',
	});

	useEffect(() => {
		setDatesSingIn((prevState: SingInProps) => ({
			email: '',
			name: '',
			password: '',
		}));
	}, []);

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSingIn = async () => {
		const dates = datesSingIn;
		if (!signInPassword) {
			dates.password = '';
		}
		const response = await User(datesSingIn);
		switch (response && response.status) {
			case 200:
				if (response.token) {
					setDatesSingIn(() => ({
						email: '',
						name: '',
						password: '',
					}));
					setToken(response.token);
					handleOnClick();
					return;
				}
				setDatesSingIn((prevState: SingInProps) => ({
					...prevState,
					name: response.name,
				}));
				setSignInPassword(true);
				break;
			default:
				setIsAccessInvalid(true);
				setTimeout(() => {
					setIsAccessInvalid(false);
				}, 5000);
				break;
		}
	};

	const handleSingUp = async () => {
		try {
			setIsLoading(true);
			const checkUp = AuthSingUp(datesSingUp);
			if (!checkUp.isValid) {
				const errorMessages = Object.values(checkUp.errors).join('\n');
				setTextInvalid(errorMessages);
				setIsRegisterInvalid(true);
				setTimeout(() => {
					setIsRegisterInvalid(false);
				}, 5000);
				return;
			}
			const company = await Cnpj(datesSingUp.cnpj);
			console.log('company',company);
			switch (company.status) {
				case 400:
					setTextInvalid('CNPJ não encontrado.');
					setIsRegisterInvalid(true);
					setTimeout(() => {
						setIsRegisterInvalid(false);
					}, 5000);
					return;
					break;

				default:
					break;
			}
			const paramsCreateAccount = {
				CNPJ: datesSingUp.cnpj,
				type_account: isCompany ? 'company' : 'client',
				email: datesSingUp.email,
				password: datesSingUp.password,
				company_name: company.company.name,
				state_registration: datesSingUp.state_registration,
				municipal_registration: datesSingUp.municipal_registration,
				responsible: datesSingUp.name,
				phone: datesSingUp.phone,
				zip_code: company.address.zip,
				city: company.address.city,
				street: company.address.street,
				uf: company.address.state,
				district: company.address.district,
				number: company.address.number,
			};
			const response = await Company(paramsCreateAccount);
			switch (response.status) {
				case 201:
					setToken(response.token);
					handleOnClick();
					return;
				case 409:
					setTextInvalid(response.message);
					setIsRegisterInvalid(true);
					setTimeout(() => {
						setIsRegisterInvalid(false);
					}, 5000);
					return;
				case 500:
					setTextInvalid(response.message);
					setIsRegisterInvalid(true);
					setTimeout(() => {
						setIsRegisterInvalid(false);
					}, 5000);
					return;
				default:
					setTextInvalid('Algo deu errado, tente novamente!');
					setIsRegisterInvalid(true);
					setTimeout(() => {
						setIsRegisterInvalid(false);
					}, 5000);
			}
		} catch (e) {
			console.log(e)
			setTextInvalid('Algo deu errado, tente novamente.');
			// setIsRegisterInvalid(true);
			// setTimeout(() => {
			// 	setIsRegisterInvalid(false);
			// }, 5000);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMouseEnterAccountClient = () => {
		setIsCardTypeAccountClient(!isCardTypeAccountClient);
	};

	const handleMouseEnterAccountCompany = () => {
		setIsCardTypeAccountCompany(!isCardTypeAccountCompany);
	};

	const handleSelectAccount = (type: string) => {
		setDatesSingUp((prevState: SingUpProps) => ({
			...prevState,
			hasType: true,
		}));
		switch (type) {
			case 'client':
				setIsClient(true);
				setIsCompany(false);
				break;
			case 'company':
				setIsCompany(true);
				setIsClient(false);
				break;
		}
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (!singUpStatus) {
					handleSingIn();
				} else {
					handleSingUp();
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleSingIn, handleSingUp, singUpStatus]);

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Sign Up' : 'Login'}
			className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
			<Page className='p-0'>
				{isAccessInvalid && (
					<div
						className='col-md-5 col-lg-3 col-sm-8 position-fixed mt-5'
						style={{ left: 5, zIndex: 10 }}>
						<Alert icon='Dangerous' color='danger' isLight shadow='md'>
							<AlertHeading tag='h4'>Acesso incorreto</AlertHeading>
							<p>Algo deu errado, tente novamente!</p>
						</Alert>
					</div>
				)}
				{isRegisterInvalid && (
					<div
						className='col-md-5 col-lg-3 col-sm-8 position-fixed mt-5'
						style={{ left: 5, zIndex: 10 }}>
						<Alert icon='Warning' color='warning' isLight shadow='md'>
							<AlertHeading tag='h4'>Registro incompleto</AlertHeading>
							<p style={{ whiteSpace: 'pre-line' }}>{textInvalid}</p>
						</Alert>
					</div>
				)}
				<div className='row h-100 align-items-center justify-content-center mt-5'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='row items-center justify-content-center'>
									<img
										src={darkModeStatus ? LogoDark : Logo}
										style={{
											height: '50%',
											width: '50%',
											objectFit: 'contain',
										}}
									/>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Entrar
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Criar Conta
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />

								{/* <Alert isLight icon='Lock' isDismissible>
									<div className='row'>
										<div className='col-12'>
											<strong>Username:</strong> {USERS.JOHN.username}
										</div>
										<div className='col-12'>
											<strong>Password:</strong> {USERS.JOHN.password}
										</div>
									</div>
								</Alert> */}
								<div className='row g-4'>
									{singUpStatus ? (
										<form className='row g-4' onSubmit={(e)=>{
											e.preventDefault();
											handleSingUp();
										}}>
											<div className='col-12'>
												<FormGroup isFloating label='CNPJ'>
													<Input
														mask='99.999.999/9999-99'
														placeholder=''
														value={datesSingUp.cnpj}
														required
														onChange={(e: any) => {
															const rawCnpj = e.target.value.replace(
																/[^\d]/g,
																'',
															); // Remove tudo que não é número
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	cnpj: rawCnpj,
																}),
															);
														}}
													/>
												</FormGroup>
											</div>
											{/* <div className='col-12'>
												<FormGroup isFloating label='Inscrição Estadual'>
													<Input
														placeholder=''
														value={datesSingUp.state_registration}
														required
														onChange={(e: any) => {
															const rawState = e.target.value.replace(
																/[^\d]/g,
																'',
															); // Remove tudo que não é número
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	state_registration: rawState,
																}),
															);
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup isFloating label='Inscrição Municipal'>
													<Input
														placeholder=''
														value={datesSingUp.municipal_registration}
														required
														onChange={(e: any) => {
															const rawMunicipal =
																e.target.value.replace(
																	/[^\d]/g,
																	'',
																); // Remove tudo que não é número
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	municipal_registration:
																		rawMunicipal,
																}),
															);
														}}
													/>
												</FormGroup>
											</div> */}
											<div className='col-12'>
												<FormGroup isFloating label='Seu nome'>
													<Input
														className='text-capitalize'
														value={datesSingUp.name}
														placeholder=''
														required
														onChange={(e: any) =>
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	name: e.target.value,
																}),
															)
														}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-phone'
													isFloating
													label='Seu celular'>
													<Input
														mask='(99) 9 9999-9999'
														autoComplete='family-name'
														value={datesSingUp.phone}
														required
														onChange={(e: any) => {
															const rawPhone = e.target.value.replace(
																/[^\d]/g,
																'',
															); // Remove tudo que não é número
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	phone: rawPhone,
																}),
															);
														}}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup isFloating label='Seu email'>
													<Input
														value={datesSingUp.email}
														placeholder=''
														required
														onChange={(e: any) =>
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	email: e.target.value,
																}),
															)
														}
													/>
												</FormGroup>
											</div>
											{/* <div className='col-12'>
												<FormGroup
													id='signup-user'
													isFloating
													label='Usuário'>
													<Input
														type='text'
														autoComplete='text'
														className='text-lowercase'
														value={datesSingUp.user}
														required
														onChange={(e: any) =>
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	user: e.target.value,
																}),
															)
														}
													/>
												</FormGroup>
											</div> */}
											<div className='col-12'>
												<FormGroup
													id='signup-password'
													isFloating
													label='Senha'>
													<Input
														value={datesSingUp.password}
														type='password'
														required
														onChange={(e: any) =>
															setDatesSingUp(
																(prevState: SingUpProps) => ({
																	...prevState,
																	password: e.target.value,
																}),
															)
														}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<h4 className='mb-2 text-muted'>
													Selecione o Tipo de Conta:
												</h4>
												<div className='row justify-content-around'>
													{/* Botão Company */}
													<Button
														onMouseEnter={
															handleMouseEnterAccountCompany
														}
														onMouseLeave={
															handleMouseEnterAccountCompany
														}
														onClick={() =>
															handleSelectAccount('company')
														}
														style={{ height: '150px' }}
														className={classNames('rounded p-1 col-5', {
															'border-2 bg-warning text-dark':
																isCompany,
															'bg-white text-dark':
																!isCompany &&
																!isCardTypeAccountCompany,
															'bg-dark text-white':
																!isCompany &&
																isCardTypeAccountCompany,
														})}>
														{!isCardTypeAccountCompany ? (
															<Icon
																icon='CustomFactory'
																size='7x'
																color='dark'
															/>
														) : (
															<div>
																<p>
																	Solução Ideal para Gestão de
																	Múltiplas Empresas
																</p>
															</div>
														)}
														<h2 className='text-dark'>
															Company
														</h2>
													</Button>

													{/* Botão Client */}
													<Button
														onMouseEnter={handleMouseEnterAccountClient}
														onMouseLeave={handleMouseEnterAccountClient}
														onClick={() =>
															handleSelectAccount('client')
														}
														style={{ height: '150px' }}
														className={classNames('rounded p-1 col-5', {
															'border-2 bg-warning text-dark':
																isClient,
															'bg-white text-dark':
																!isClient &&
																!isCardTypeAccountClient,
															'bg-dark text-white':
																!isClient &&
																isCardTypeAccountClient,
														})}>
														{!isCardTypeAccountClient ? (
															<Icon
																icon='Maps Home Work'
																size='7x'
																color='dark'
															/>
														) : (
															<div>
																<p>
																	Solução Perfeita para Empresas
																	Conectadas ou Independentes
																</p>
															</div>
														)}
														<h2 className='text-dark'>
															Client
														</h2>
													</Button>
												</div>
											</div>
											<div className='col-12'>
												<Button
													color='warning'
													className='w-100 py-3'
													type='submit'
												>
													{isLoading && (
														<Spinner isSmall inButton isGrow />
													)}
													Cadastrar
												</Button>
											</div>
										</form>
									) : (
										// up
										<>
											<div className='col-12'>
												{!signInPassword && (
													<FormGroup
														id='loginUsername'
														isFloating
														label='Seu E-mail'>
														<Input
															autoComplete='email'
															value={datesSingIn.email}
															onChange={(e: any) =>
																setDatesSingIn(
																	(prevState: SingInProps) => ({
																		...prevState,
																		email: e.target.value,
																	}),
																)
															}
														/>
													</FormGroup>
												)}
												{signInPassword && (
													<div className='text-center h4 mb-3 fw-bold text-capitalize'>
														Oi, {Mask('firstName', datesSingIn.name)}.
													</div>
												)}
												{signInPassword && (
													<FormGroup
														id='loginPassword'
														isFloating
														label='Senha'>
														<Input
															autoComplete='current-password'
															type='password'
															value={datesSingIn.password}
															onChange={(e: any) => {
																setDatesSingIn(
																	(prevState: SingInProps) => ({
																		...prevState,
																		password: e.target.value,
																	}),
																);
															}}
														/>
													</FormGroup>
												)}
											</div>
											<div className='col-12'>
												{!signInPassword || datesSingIn.password === '' ? (
													<Button
														color='warning'
														className='w-100 py-3'
														onClick={handleSingIn}>
														{isLoading && (
															<Spinner isSmall inButton isGrow />
														)}
														Continuar
													</Button>
												) : (
													<Button
														color='warning'
														className='w-100 py-3'
														onClick={handleSingIn}>
														Login
													</Button>
												)}
											</div>
										</>
									)}

									{/* BEGIN :: Social Login */}
									{/* {!signInPassword && (
										<>
											<div className='col-12 mt-3 text-center text-muted'>
												OR
											</div>
											<div className='col-12 mt-3'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomApple'
													onClick={handleOnClick}>
													Sign in with Apple
												</Button>
											</div>
											<div className='col-12'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomGoogle'
													onClick={handleOnClick}>
													Continue with Google
												</Button>
											</div>
										</>
									)} */}
									{/* END :: Social Login */}
								</div>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Terms of use
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
//@ts-ignore
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
