import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
// import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert, { AlertHeading } from '../../../components/bootstrap/Alert';
import Logo from '../../../assets/logo/logo.png'
import Icon from '../../../components/icon/Icon';


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
LoginHeader.defaultProps = {
	isNewUser: false,
};

interface ILoginProps {
	isSignUp?: boolean;
};

interface registerProps {
	cnpj:  string,
    name:  string,
    phone: string,
    user:  string,
    password: string;
};

const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const { setUser } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const [isCardTypeAccountClient, setIsCardTypeAccountClient]   = useState<boolean>(false)
	const [isCardTypeAccountCompany, setIsCardTypeAccountCompany] = useState<boolean>(false)
	const [isCompany, setIsCompany] = useState<boolean>(false)
	const [isClient , setIsClient ] = useState<boolean>(false)

	const [isAccessInvalid , setIsAccessInvalid ] = useState<boolean>(false)
	const [isRegisterInvalid , setIsRegisterInvalid ] = useState<boolean>(false)
	const [textInvalid , setTextInvalid ] = useState<string | false>(false)

	const [datesRegister, setDatesRegister] = useState<registerProps | null>(null);


	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);

	const usernameCheck = (username: string) => {
		return !!getUserDataWithUsername(username);
	};

	const passwordCheck = (username: string, password: string) => {
		return getUserDataWithUsername(username).password === password;
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginUsername: USERS.JOHN.username,
			loginPassword: USERS.JOHN.password,
			cnpj: '',
			name: '',
			surname: '',
			user: '',
			password: '',
		},
		validate: (values) => {
			const errors: { loginUsername?: string; loginPassword?: string } = {};

			if (!values.loginUsername) {
				errors.loginUsername = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}

			return errors;
		},
		validateOnChange: false,
		onSubmit: (values) => {
			if (usernameCheck(values.loginUsername)) {
				if (passwordCheck(values.loginUsername, values.loginPassword)) {
					if (setUser) {
						setUser(values.loginUsername);
					}

					handleOnClick();
				} else {
					formik.setFieldError('loginPassword', 'Username and password do not match.');
				}
			}
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleContinue = () => {
		setIsLoading(true);
		setTextInvalid('Nome Incorreto')
		setIsRegisterInvalid(true);
		setTimeout(() => {
			setIsLoading(false);
			setIsRegisterInvalid(false);
		}, 5000);

		// setTimeout(() => {
		// 	if (
		// 		!Object.keys(USERS).find(
		// 			(f) => USERS[f].username.toString() === formik.values.loginUsername,
		// 		)
		// 	) {
		// 		formik.setFieldError('loginUsername', 'No such user found in the system.');
		// 	} else {
		// 		setSignInPassword(true);
		// 	}
		// 	setIsLoading(false);
		// }, 1000);
	};

	const handleMouseEnterAccountClient = () => {
		setIsCardTypeAccountClient(!isCardTypeAccountClient)
	};

	const handleMouseEnterAccountCompany = () => {
		setIsCardTypeAccountCompany(!isCardTypeAccountCompany)
	};

	const handleSelectAccount = (type:string) =>{
		switch (type) {
			case 'client':
				setIsClient(true)
				setIsCompany(false)
				break;
			case 'company':
				setIsCompany(true)
				setIsClient(false)	
				break;
		}
	};

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Sign Up' : 'Login'}
			className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
			<Page className='p-0'>
				{ isAccessInvalid &&
					<div className='col-md-5 col-lg-3 col-sm-8 position-fixed mt-5' style={{left:5, zIndex:10}}>
						<Alert
							icon='Dangerous'
							color='danger'
							isLight={true}
							shadow={'md'}
						>
							<AlertHeading
								tag={'h4'}
							>
								Acesso incorreto
							</AlertHeading>
							<p>Algo deu errado, tente novamente!</p>
						</Alert>
					</div>
				}
				{ isRegisterInvalid &&
					<div className='col-md-5 col-lg-3 col-sm-8 position-fixed mt-5' style={{left:5, zIndex:10}}>
						<Alert
							icon='Warning'
							color='warning'
							isLight={true}
							shadow={'md'}
						>
							<AlertHeading
								tag={'h4'}
							>
								Registro incompleto
							</AlertHeading>
							<p>{textInvalid}</p>
						</Alert>
					</div>
				}
				<div className='row h-100 align-items-center justify-content-center mt-5'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='row items-center justify-content-center'>
									<img 
										src={Logo}
										style={{height:'50%', width:'50%', objectFit: 'contain'}}
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
								<form className='row g-4' onSubmit={formik.handleSubmit}>
									{singUpStatus ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='signup-cnpj'
													isFloating
													label='CNPJ'>
													<Input type='email' autoComplete='email' required />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-name'
													isFloating
													label='Seu nome'>
													<Input autoComplete='given-name' required />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-phone'
													isFloating
													label='Seu celular'>
													<Input autoComplete='family-name' required />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-user'
													isFloating
													label='Usuário'>
													<Input
														type='text'
														autoComplete='text'
														required
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-password'
													isFloating
													label='Senha'>
													<Input
														type='password'
														autoComplete='password'
														required
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<h4 className='mb-2 text-muted'>
													Selecione o Tipo de Conta:
												</h4>
												<div className='row justify-content-around'>
													<Button 
														onMouseEnter={handleMouseEnterAccountCompany}
														onMouseLeave={handleMouseEnterAccountCompany}
														style={{height:'150px'}}
														onClick={()=>handleSelectAccount('company')}
														className={classNames(
															{
																'bg-white': !isCardTypeAccountCompany,
																'bg-dark'    : isCardTypeAccountCompany,
															},
															`rounded p-1 col-5 ${isCompany && 'border-2 border-dark'}`,
														)}
													>
														{ !isCardTypeAccountCompany ?
															<Icon icon='CustomFactory' size='7x' color={'dark'} />
															:
															<div className='text-white'>
																<p>
																	Solução Ideal para Gestão de Múltiplas Empresas
																</p>
															</div>
														}
														<h2 className={`text-dark ${isCardTypeAccountCompany && 'text-white'}`}>Company</h2>
													</Button>
													<Button 
														onMouseEnter={handleMouseEnterAccountClient}
														onMouseLeave={handleMouseEnterAccountClient}
														style={{height:'150px'}}
														onClick={()=>handleSelectAccount('client')}
														className={classNames(
															`rounded p-1 col-5 ${isClient && 'border-2 border-dark '}`,
															{
															'bg-white': !isCardTypeAccountClient,
															'bg-dark' : isCardTypeAccountClient,
														})}
													>
														{ !isCardTypeAccountClient ?
															<Icon icon='Maps Home Work' size='7x' color='dark' />
															:
															<div className='text-white'>
																<p>
																	Solução Perfeita para Empresas Conectadas ou Independentes
																</p>
															</div>
														}
														<h2 className={`text-dark ${isCardTypeAccountClient && 'text-white'}`}>Client</h2>
													</Button>
												</div>
											</div>
											<div className='col-12'>
												<Button
													color='warning'
													className='w-100 py-3'
													type={ 'submit' }
													onClick={handleOnClick}
													>
													Cadastrar
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup
													id='loginUsername'
													isFloating
													label='Seu usuário'
													className={classNames({
														'd-none': signInPassword,
													})}>
													<Input
														autoComplete='username'
														value={formik.values.loginUsername}
														isTouched={formik.touched.loginUsername}
														invalidFeedback={
															formik.errors.loginUsername
														}
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														onFocus={() => {
															formik.setErrors({});
														}}
													/>
												</FormGroup>
												{signInPassword && (
													<div className='text-center h4 mb-3 fw-bold'>
														Oi, {formik.values.loginUsername}.
													</div>
												)}
												<FormGroup
													id='loginPassword'
													isFloating
													label='Password'
													className={classNames({
														'd-none': !signInPassword,
													})}>
													<Input
														type='password'
														autoComplete='current-password'
														value={formik.values.loginPassword}
														isTouched={formik.touched.loginPassword}
														invalidFeedback={
															formik.errors.loginPassword
														}
														validFeedback='Looks good!'
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												{!signInPassword ? (
													<Button
														color='warning'
														className='w-100 py-3'
														isDisable={!formik.values.loginUsername}
														onClick={handleContinue}>
														{isLoading && (
															<Spinner isSmall inButton isGrow />
														)}
														Continuar
													</Button>
												) : (
													<Button
														color='warning'
														className='w-100 py-3'
														onClick={formik.handleSubmit}>
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
								</form>
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
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
