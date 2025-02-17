import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Wizard, { WizardItem } from '../../../components/Wizard';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Avatar from '../../../components/Avatar';
import User1Webp from '../../../assets/img/wanna/wanna2.webp';
import User1Img from '../../../assets/img/wanna/wanna2.png';
import CompanyLogoDefault from '../../../assets/img/companyLogoDefault.png';
import CompanyWallet from './CompanyWallet';
// import editPasswordValidate from './helper/editPasswordValidate';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { demoPagesMenu } from '../../../menu';
import useDarkMode from '../../../hooks/useDarkMode';
import GetCompanyDocument from '../../../api/get/company/Document';
import AuthContext from '../../../contexts/authContext';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';
import PostCompanyDocument from '../../../api/post/company/Document';
import Spinner from '../../../components/bootstrap/Spinner';
import GetCompanyFindOne from '../../../api/get/company/FindOne';
import PatchCompanyDefault from '../../../api/patch/company/Default';
import DeleteCompanyFile from '../../../api/delete/company/File';
import CompanyUser from './CompanyUser';

interface IPreviewItemProps {
	title: string;
	value: any | any[];
}

const PreviewItem: FC<IPreviewItemProps> = ({ title, value }) => {
	return (
		<>
			<div className='col-3 text-end'>{title}</div>
			<div className='col-9 fw-bold'>{value || '-'}</div>
		</>
	);
};

interface IValues {
	cnpj: string;
	company_name: string;
	state_registration: string;
	municipal_registration: string;

	email: string;
	phone: string;
	responsible: string;

	street: string;
	number: string;
	district: string;
	city: string;
	state: string;
	uf: string;
	zip: string;
}

const validationSchema = Yup.object().shape({
	cnpj: Yup.string()
		.matches(/^\d{14}$/, 'CNPJ deve ter 14 números')
		.required('CNPJ é obrigatório'),
	company_name: Yup.string()
		.min(3, 'Razão Social deve ter pelo menos 3 caracteres')
		.max(100, 'Razão Social deve ter no máximo 100 caracteres')
		.required('Razão Social é obrigatória'),
	state_registration: Yup.string()
		.max(20, 'Inscrição Estadual deve ter no máximo 20 caracteres')
		.required('Inscrição Municipal é obrigatória'),
	municipal_registration: Yup.string()
		.max(20, 'Inscrição Municipal deve ter no máximo 20 caracteres')
		.required('Inscrição Municipal é obrigatória'),
	email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
	phone: Yup.string()
		.matches(/^\d{10,11}$/, 'Telefone deve ter entre 10 e 11 números')
		.required('Telefone é obrigatório'),
	responsible: Yup.string()
		.min(3, 'Responsável deve ter pelo menos 3 caracteres')
		.max(50, 'Responsável deve ter no máximo 50 caracteres')
		.required('Responsável é obrigatório'),
	street: Yup.string()
		.min(3, 'Logradouro deve ter pelo menos 3 caracteres')
		.max(100, 'Logradouro deve ter no máximo 100 caracteres')
		.required('Logradouro é obrigatório'),
	number: Yup.string().matches(/^\d*$/, 'Número deve ser numérico'), // Não obrigatório, mas deve ser numérico
	district: Yup.string()
		.min(3, 'Bairro deve ter pelo menos 3 caracteres')
		.max(50, 'Bairro deve ter no máximo 50 caracteres')
		.required('Bairro é obrigatório'),
	city: Yup.string()
		.min(3, 'Cidade deve ter pelo menos 3 caracteres')
		.max(50, 'Cidade deve ter no máximo 50 caracteres')
		.required('Cidade é obrigatória'),
	state: Yup.string().required('Estado é obrigatório'),
	uf: Yup.string()
		.matches(/^[A-Z]{2}$/, 'UF deve ter exatamente 2 letras maiúsculas')
		.required('UF é obrigatório'),
	zip: Yup.string()
		.matches(/^\d{8}$/, 'CEP deve ter exatamente 8 números')
		.required('CEP é obrigatório'),
});

const CompanyPage = () => {
	const navigate = useNavigate();
	const { userData } = useContext(AuthContext);
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [companyDates, setCompanyDates] = useState<null | any>(null);
	const [logoPath, setLogoPath] = useState<null | string>(null);
	const [signaturePath, setSignaturePath] = useState<null | string>(null);
	const [newLogoPathh, setNewLogoPath] = useState<any>(null);
	const [newSignaturePath, setNewSignaturePath] = useState<null | any>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const TABS = {
		ACCOUNT_DETAIL: 'Informação',
		SIGNATURE: 'Assinatura',
		MY_WALLET: 'Carteira',
		PLAN: 'Plano',
		USER: 'Usuários'
	};

	const [activeTab, setActiveTab] = useState(TABS.ACCOUNT_DETAIL);

	const formik = useFormik({
		initialValues: {
			cnpj: '',
			company_name: '',
			state_registration: '',
			municipal_registration: '',

			email: '',
			phone: '',
			responsible: '',

			isVisible: '',

			street: '',
			number: '',
			district: '',
			city: '',
			state: '',
			uf: '',
			zip: '',
		},
		validationSchema: validationSchema,
		onSubmit: () => {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Updated Successfully</span>
				</span>,
				"The user's account details have been successfully updated.",
			);
		},
	});

	const clickSignature = async () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const uploadSignature = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				setNewSignaturePath(file);
				const imageUrl = URL.createObjectURL(file);
				setSignaturePath(imageUrl);
				return;
			} else {
				toast(
					<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
						Selecione <b>apenas</b> arquivo de imagem.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 3000,
					},
				);
			}
		}
	};

	const saveSignature = async () => {
		const PropsUpload = {
			file: newSignaturePath,
			document: 'Signature',
			cnpj: userData.cnpj,
		};

		let response = await PostCompanyDocument(PropsUpload);
		if (response.status !== 200) {
			toast(
				<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
					Algo deu errado, tente mais tarde.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 3000,
				},
			);
			return;
		}
	};

	const uploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			// Define o arquivo no estado

			// Validação do tipo de arquivo
			if (file.type.startsWith('image/')) {
				setNewLogoPath(file);
				const imageUrl = URL.createObjectURL(file);
				// Define o URL da imagem no estado
				setLogoPath(imageUrl);
				return;
			} else {
				// Exibe um toast em caso de erro
				toast(
					<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
						Selecione <b>apenas</b> arquivo de imagem.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 3000,
					},
				);
			}

			// Opcional: Resetar o input file após processamento
			event.target.value = ''; // Permite resetar o campo caso necessário
		}
	};

	const removeLogo = async () => {
		const response = await DeleteCompanyFile(`company/${userData.cnpj}/Logo`);
		if (response.status == 200) {
			toast(
				<Toasts icon={'Check'} iconColor={'success'} title={'Sucesso'}>
					Logo deletada com sucesso
				</Toasts>,
				{
					closeButton: true,
					autoClose: 3000,
				},
			);
			setLogoPath(null);
			setNewLogoPath(null);
			return;
		}
		toast(
			<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
				Erro ao tentar deletar sua logo, tente mais tarde
			</Toasts>,
			{
				closeButton: true,
				autoClose: 3000,
			},
		);
	};

	const updateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (newLogoPathh) {
				console.log('caiu aqui');
				const PropsUpload = {
					file: newLogoPathh,
					document: 'Logo',
					cnpj: userData.cnpj,
				};
				const response = await PostCompanyDocument(PropsUpload);
				if (response.status !== 200) {
					<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
						Algo deu errado, não foi possível atualizar a <b>Logo</b>.
					</Toasts>;
					return;
				}
			}
			const response = await PatchCompanyDefault(formik.values, userData.cnpj);
			if (response.status == 200) {
				toast(
					<Toasts icon={'Check'} iconColor={'success'} title={'Sucesso'}>
						{response.message}
					</Toasts>,
					{
						closeButton: true,
						autoClose: 3000,
					},
				);
				return;
			} else {
				toast(
					<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
						{response.message}
					</Toasts>,
					{
						closeButton: true,
						autoClose: 3000,
					},
				);
			}
		} catch (e) {
			<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
				Algo deu errado, tente mais tarde.
			</Toasts>;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (userData) {
				const response = await GetCompanyFindOne(userData.cnpj);
				if (response.status == 200) {
					formik.setValues(response.company);
					formik.setFieldValue('cnpj', response.company.CNPJ);
					formik.setFieldValue('zip', response.company.zip_code);
					setCompanyDates(response.company);
					setLogoPath(response.logo);
					setSignaturePath(response.signature);
				}
			}
		};
		fetchData();
	}, [userData]);

	return (
		<PageWrapper title={demoPagesMenu.editPages.subMenu.editWizard.text}>
			<SubHeader>
				<SubHeaderLeft>
					{logoPath ? (
						<Avatar src={logoPath} size={32} />
					) : (
						<Avatar src={CompanyLogoDefault} size={32} />
					)}
					{companyDates && (
						<span>
							<strong>{companyDates.company_name}</strong>
						</span>
					)}
					<span className='text-muted'>Company</span>
				</SubHeaderLeft>
			</SubHeader>
			<Page>
				<div className='row h-100 pb-3'>
					<div className='col-lg-4 col-md-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='CorporateFare'>
									<CardTitle tag='div' className='h5'>
										Informações da Empresa
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody isScrollable>
								<div className='row g-3'>
									<div className='col-12'>
										<Button
											icon='Contacts'
											color='info'
											className='w-100 p-3'
											isLight={TABS.ACCOUNT_DETAIL !== activeTab}
											onClick={() => setActiveTab(TABS.ACCOUNT_DETAIL)}>
											{TABS.ACCOUNT_DETAIL}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Edit'
											color='info'
											className='w-100 p-3'
											isLight={TABS.SIGNATURE !== activeTab}
											onClick={() => setActiveTab(TABS.SIGNATURE)}>
											{TABS.SIGNATURE}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Style'
											color='info'
											className='w-100 p-3'
											isLight={TABS.MY_WALLET !== activeTab}
											onClick={() => setActiveTab(TABS.MY_WALLET)}>
											{TABS.MY_WALLET}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Person'
											color='info'
											className='w-100 p-3'
											isLight={TABS.PLAN !== activeTab}
											onClick={() => setActiveTab(TABS.USER)}>
											{TABS.USER}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='ShoppingCart'
											color='warning'
											className='w-100 p-3'
											isLight={TABS.PLAN !== activeTab}
											onClick={() => setActiveTab(TABS.PLAN)}>
											{TABS.PLAN}
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8 col-md-6'>
						{TABS.ACCOUNT_DETAIL === activeTab && (
							<Wizard
								isHeader
								stretch
								color='info'
								noValidate
								onSubmit={(e: React.FormEvent<HTMLFormElement>) => updateCompany(e)}
								className='shadow-3d-info'>
								<WizardItem id='step1' title='Detalhes da Empresa'>
									<Card>
										<CardBody>
											<div className='row g-4 align-items-center'>
												<div className='col-xl-auto'>
													{logoPath ? (
														<Avatar src={logoPath} />
													) : (
														<div
															style={{ width: 122, height: 122 }}
															className={`rounded-circle  ${darkModeStatus ? 'bg-white' : 'bg-info'}`}>
															<img
																className='position-absolute'
																style={{ top: '0px', left: '16px' }}
																width={122}
																height={122}
																src={CompanyLogoDefault}
																alt='Company Logo'
															/>
														</div>
													)}
												</div>
												<div className='col-xl'>
													<div className='row g-4'>
														<div className='col-auto'>
															<Input
																type='file'
																autoComplete='photo'
																ariaLabel='Upload image file'
																onChange={uploadLogo}
															/>
														</div>
														<div className='col-auto'>
															{logoPath && (
																<Button
																	color='dark'
																	isLight
																	icon='Delete'
																	onClick={removeLogo}>
																	Deletar
																</Button>
															)}
														</div>
														<div className='col-12'>
															<p className='lead text-muted'>
																A logo da sua empresa ajudará a te
																identificar.
															</p>
														</div>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>

									<Card>
										<CardHeader>
											<CardLabel icon='Edit' iconColor='warning'>
												<CardTitle>Informação e Detalhes</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-md-6'>
													<FormGroup id='cnpj' label='CNPJ' isFloating>
														<Input
															placeholder='CNPJ'
															disabled={true}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.cnpj}
															isValid={formik.isValid}
															isTouched={formik.touched.cnpj}
															invalidFeedback={formik.errors.cnpj}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='state_registration'
														label='Inscrição Estadual'
														isFloating>
														<Input
															disabled={true}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.state_registration}
															isValid={formik.isValid}
															isTouched={
																formik.touched.state_registration
															}
															invalidFeedback={
																formik.errors.state_registration
															}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='company_name'
														label='Nome da Empresa'
														isFloating
														formText='Será com essas informações que sua empresa será exibida.'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.company_name}
															isValid={formik.isValid}
															isTouched={formik.touched.company_name}
															invalidFeedback={
																formik.errors.company_name
															}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id='municipal_registration'
														label='Inscrição Municipal'
														isFloating>
														<Input
															disabled={true}
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={
																formik.values.municipal_registration
															}
															isValid={formik.isValid}
															isTouched={
																formik.touched
																	.municipal_registration
															}
															invalidFeedback={
																formik.errors.municipal_registration
															}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
											</div>
										</CardBody>
									</Card>

									<Card className='mb-0'>
										<CardHeader>
											<CardLabel icon='MarkunreadMailbox' iconColor='success'>
												<CardTitle>Contato</CardTitle>
											</CardLabel>
										</CardHeader>
										<CardBody className='pt-0'>
											<div className='row g-4'>
												<div className='col-12'>
													<FormGroup
														id='responsible'
														label='Responsável'
														isFloating>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.responsible}
															isValid={formik.isValid}
															isTouched={formik.touched.responsible}
															invalidFeedback={
																formik.errors.responsible
															}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
												<div className='col-12'>
													<FormGroup
														id='phone'
														label='Telefone'
														isFloating>
														<Input
															placeholder='Phone'
															type='tel'
															autoComplete='tel'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.phone}
															isValid={formik.isValid}
															isTouched={formik.touched.phone}
															invalidFeedback={formik.errors.phone}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
												<div className='col-12'>
													<FormGroup id='email' label='Email' isFloating>
														<Input
															type='email'
															placeholder='Email address'
															autoComplete='email'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.email}
															isValid={formik.isValid}
															isTouched={formik.touched.email}
															invalidFeedback={formik.errors.email}
															validFeedback='Ótimo!'
														/>
													</FormGroup>
												</div>
											</div>
										</CardBody>
									</Card>
								</WizardItem>
								<WizardItem id='step2' title='Endereço'>
									<div className='row g-4'>
										<div className='col-lg-12'>
											<FormGroup id='street' label='Rua' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.street}
													isValid={formik.isValid}
													isTouched={formik.touched.street}
													invalidFeedback={formik.errors.street}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-8'>
											<FormGroup id='district' label='Bairro' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.district}
													isValid={formik.isValid}
													isTouched={formik.touched.district}
													invalidFeedback={formik.errors.district}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-4'>
											<FormGroup id='number' label='Número' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.number}
													isValid={formik.isValid}
													isTouched={formik.touched.number}
													invalidFeedback={formik.errors.number}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										</div>
										<div className='col-lg-6'>
											<FormGroup id='city' label='Cidade' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.city}
													isValid={formik.isValid}
													isTouched={formik.touched.city}
													invalidFeedback={formik.errors.city}
													validFeedback='Ótimo!'
												/>
											</FormGroup>
										</div>
										<div className='col-md-3'>
											<FormGroup id='state' label='UF' isFloating>
												<Select
													ariaLabel='UF'
													placeholder='UF'
													list={[
														{ value: 'Acre', text: 'AC' },
														{ value: 'Alagoas', text: 'AL' },
														{ value: 'Amapá', text: 'AP' },
														{ value: 'Amazonas', text: 'AM' },
														{ value: 'Bahia', text: 'BA' },
														{ value: 'Ceará', text: 'CE' },
														{ value: 'Distrito Federal', text: 'DF' },
														{ value: 'Espírito Santo', text: 'ES' },
														{ value: 'Goiás', text: 'GO' },
														{ value: 'Maranhão', text: 'MA' },
														{ value: 'Mato Grosso', text: 'MT' },
														{ value: 'Mato Grosso do Sul', text: 'MS' },
														{ value: 'Minas Gerais', text: 'MG' },
														{ value: 'Pará', text: 'PA' },
														{ value: 'Paraíba', text: 'PB' },
														{ value: 'Paraná', text: 'PR' },
														{ value: 'Pernambuco', text: 'PE' },
														{ value: 'Piauí', text: 'PI' },
														{ value: 'Rio de Janeiro', text: 'RJ' },
														{
															value: 'Rio Grande do Norte',
															text: 'RN',
														},
														{ value: 'Rio Grande do Sul', text: 'RS' },
														{ value: 'Rondônia', text: 'RO' },
														{ value: 'Roraima', text: 'RR' },
														{ value: 'Santa Catarina', text: 'SC' },
														{ value: 'São Paulo', text: 'SP' },
														{ value: 'Sergipe', text: 'SE' },
														{ value: 'Tocantins', text: 'TO' },
													]}
													onChange={(
														event: React.SyntheticEvent<HTMLSelectElement>,
													) => {
														const selectedOption = (
															event.target as HTMLSelectElement
														).selectedOptions[0];
														const state =
															selectedOption.getAttribute('value');
														const UF = selectedOption.textContent;
														formik.setFieldValue('state', state);
														formik.setFieldValue('uf', UF);
													}}
													onBlur={formik.handleBlur}
													value={formik.values.state}
													isValid={formik.isValid}
													isTouched={formik.touched.state}
													invalidFeedback={formik.errors.state}
												/>
											</FormGroup>
										</div>
										<div className='col-md-3'>
											<FormGroup id='zip' label='CEP' isFloating>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.zip}
													isValid={formik.isValid}
													isTouched={formik.touched.zip}
													invalidFeedback={formik.errors.zip}
												/>
											</FormGroup>
										</div>
									</div>
								</WizardItem>
								<WizardItem id='step3' title='Visibilidade'>
									<div className='row g-4'>
										<div className='col-12'>
											<FormGroup>
												<Label htmlFor='Visualização dos candidatos'>
													Visualização da sua empresa
												</Label>
												<ChecksGroup>
													<Checks
														type='switch'
														id={`isVisible`}
														name='isVisible'
														label={'Anônimo'}
														checked={
															formik.values.isVisible == '1'
																? true
																: false
														}
														value={formik.values.isVisible}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>,
														) => {
															const value = event.target.checked
																? '1'
																: '0'; // Define '1' para true e '0' para false
															formik.setFieldValue(
																'isVisible',
																value,
															); // Atualiza o campo no Formik
														}}
													/>
												</ChecksGroup>
											</FormGroup>
										</div>
										<div className='col-12'>
											<p>
												Ao optar pelo{' '}
												<span className='fw-bold'>anonimato</span>, as
												informações da sua empresa serão ocultadas de
												candidatos e outras empresas, o que pode dificultar
												sua identificação.
											</p>
										</div>
									</div>
								</WizardItem>
								<WizardItem id='step4' title='Visualização Geral'>
									<div className='row g-3'>
										<div className='col-9 offset-3'>
											<h3 className='mt-4'>Review</h3>
											<h4 className='mt-4'>Informação e Detalhes</h4>
										</div>
										<PreviewItem title='CNPJ' value={formik.values.cnpj} />
										<PreviewItem
											title='Inscrição Municipal'
											value={formik.values.municipal_registration}
										/>
										<PreviewItem
											title='Inscrição Estadual'
											value={formik.values.state_registration}
										/>
										<PreviewItem
											title='Nome da Empresa'
											value={formik.values.company_name}
										/>
										<div className='col-9 offset-3'>
											<h4 className='mt-4'>Contato</h4>
										</div>
										<PreviewItem
											title='Responsável'
											value={formik.values.responsible}
										/>
										<PreviewItem title='Telefone' value={formik.values.phone} />
										<PreviewItem title='Email' value={formik.values.email} />
										<div className='col-9 offset-3'>
											<h3 className='mt-4'>Endereço</h3>
										</div>
										<PreviewItem title='Rua' value={formik.values.street} />
										<PreviewItem
											title='Bairro'
											value={formik.values.district}
										/>
										<PreviewItem title='UF' value={formik.values.uf} />
										<PreviewItem title='Número' value={formik.values.number} />
										<PreviewItem title='Estado' value={formik.values.state} />
										<PreviewItem title='Cidade' value={formik.values.city} />
										<PreviewItem title='CEP' value={formik.values.zip} />

										<div className='col-9 offset-3'>
											<h4 className='mt-4'>Visibilidade</h4>
										</div>
										<PreviewItem
											title='Anônimato'
											value={formik.values.isVisible == '1' ? 'Sim' : 'Não'}
										/>
										{/* <PreviewItem
											title='Push Notifications'
											value={notificationTypes.map(
												(cat) =>
													formik.values.pushNotification.includes(
														cat.id.toString(),
													) && `${cat.name}, `,
											)}
										/> */}
									</div>
								</WizardItem>
							</Wizard>
						)}
						{TABS.SIGNATURE === activeTab && (
							<Card stretch>
								<CardHeader>
									<CardLabel icon='Edit' iconColor='info'>
										<CardTitle>{TABS.SIGNATURE}</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pb-0' isScrollable>
									<div className='row g-4'>
										<Card
											className={` ${signaturePath && 'bg-white overflow-hidden'}`}>
											<CardBody
												className='d-flex justify-content-center align-items-center'
												style={{ height: '300px' }}>
												{signaturePath ? (
													<div className='rounded h-50 w-50 d-flex justify-content-center align-items-center'>
														<img
															src={signaturePath}
															alt='Assinatura da empresa'
															className='mx-auto d-block img-fluid mb-3 w-100'
														/>
													</div>
												) : (
													<div
														className='shadow-3d-up-hover w-full h-100 d-flex justify-content-center align-items-center cursor-pointer'
														onClick={clickSignature}>
														<div>
															<h1 className='m-0 p-0'>
																Adicione sua Assinatura{' '}
																<Icon icon='AddCircle' />
															</h1>
															Não há assinaturas ativas
														</div>
													</div>
												)}
											</CardBody>
											<input
												type='file'
												ref={fileInputRef}
												accept='image/*'
												className='d-none'
												onChange={uploadSignature}
											/>
										</Card>
									</div>
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										{signaturePath && (
											<Button
												color='info'
												isLink
												type='reset'
												onClick={clickSignature}>
												Atualizar Assinatura
											</Button>
										)}
									</CardFooterLeft>
									<CardFooterRight>
										{newSignaturePath && (
											<Button
												type='submit'
												icon='Save'
												color='info'
												isOutline
												onClick={saveSignature}>
												Salvar
											</Button>
										)}
									</CardFooterRight>
								</CardFooter>
							</Card>
						)}
						{TABS.PLAN === activeTab && (
							<Card stretch>
								<CardHeader>
									<CardLabel icon='ShoppingCart' iconColor='warning'>
										<CardTitle>{TABS.PLAN}</CardTitle>
									</CardLabel>
								</CardHeader>

								<CardBody className='pb-0 d-flex justify-content-center' isScrollable>
									<div className='col-md-4'>
										<Card>
											<CardBody className=''>
												<div className='row pt-5 g-4 text-center'>
													<div className='col-12'>
														<Icon
															icon='CustomRocketLaunch'
															size='4x'
															color='warning'
														/>
													</div>
													<div className='col-12'>
														<h4>Startup Company</h4>
													</div>
													<div className='col-12'>
														<h3 className='display-4 fw-bold'>
															<span className='display-4 fw-bold'>
																$
															</span>
															219
															<span className='display-6'>/mês</span>
														</h3>
													</div>
													<div className='col-12'>
														<div className='lead'>
															<Icon
																icon='Done Outline'
																color='success'
															/>{' '}
															Exclusive Workspace
														</div>
														<div className='lead'>
															<Icon
																icon='Done Outline'
																color='success'
															/>{' '}
															Internet Connection
														</div>
														<div className='lead text-muted'>
															<Icon icon='Close' color='danger' />{' '}
															Meeting Room
														</div>
														<div className='lead text-muted'>
															<Icon icon='Close' color='danger' />{' '}
															Small Rest Room
														</div>
													</div>
													<div className='col-12'>
														<p>Lorem ipsum dolor sit amet.</p>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
								</CardBody>

								<CardFooter>
									<CardFooterLeft>
										<Button
											color='warning'
											isLink
											type='reset'
											isDisable
											icon='Sync'
											onClick={() => {}}>
											Atualizar Plano
										</Button>
									</CardFooterLeft>
								</CardFooter>
							</Card>
						)}
						{TABS.MY_WALLET === activeTab && <CompanyWallet />}
						{TABS.USER === activeTab && <CompanyUser />}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default CompanyPage;
