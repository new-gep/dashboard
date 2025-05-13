import * as React from 'react';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import { mainMenu, secondaryPath } from '../../../../menu';
import SubHeader, {
	SubHeaderLeft,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Select from '../../../../components/bootstrap/forms/Select';
import Option from '../../../../components/bootstrap/Option';
import Input from '../../../../components/bootstrap/forms/Input';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import AuthContext from '../../../../contexts/authContext';
import { AbstractPicture } from '../../../../constants/abstract';
import Toasts from '../../../../components/bootstrap/Toasts';
import JobUpdate from '../../../../api/patch/Job';
import Job from '../../../../api/post/Job';
import Card, {
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Icon from '../../../../components/icon/Icon';
import Button from '../../../../components/bootstrap/Button';
import Avatar from '../../../../components/Avatar';
import { AvatarPicture } from '../../../../constants/avatar';
import Mask from '../../../../function/Mask';
import FindCep from '../../../../api/get/Cep';
import Label from '../../../../components/bootstrap/forms/Label';
import FormJob from './helper/form';
import SendFunction from './helper/sendFunction';
import SelectOptionJob from './helper/selectOption';
import Chat from './helper/chat';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
import RecruitAutoComplet from '../../../../api/assistant/recruit/autoComplet';

type AbstractPictureKeys = keyof typeof AbstractPicture;

interface Ijob {
	user_create?: any;
	image: string;
	PCD: string;
	DEI: string;
	function: string;
	salary: any;
	time: any;
	journey: string;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	cep: string;
	logradouro: string;
	uf: string;
	bairro: string;
	numero: string;
	complemento: string;
	CNPJ_company?: string;
}

interface IjobUpdate {
	image: string;
	PCD: string;
	DEI: string;
	function: string;
	salary: any;
	time: any;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	cep: string;
	logradouro: string;
	uf: string;
	bairro: string;
	numero: string;
	complemento: string;
	user_edit?: string;
}

interface IValues {
	image: any;
	PCD: string;
	DEI: string;
	function: string;
	salary: any;
	locality: string;
	model: string;
	contract: string;
	requirements: string;
	responsibility: string;
	cep: string;
}

export default function CreateJob() {
	const { userData } = React.useContext(AuthContext);
	const [editItem, setEditItem] = React.useState<IValues | null>(null);
	const [editPanel, setEditPanel] = React.useState<boolean>(false);
	const [loaderRecruit, setLoaderRecruit] = React.useState<boolean>(false);
	const [decision, setDecision] = React.useState<string | null>(null);
	const [initial, setInitial] = React.useState<boolean>(false);
	const [sendFunction, setSendFunction] = React.useState<boolean>(false);
	const [IAactive, setIAactive] = React.useState<boolean>(false);
	const [IAthread, setIAthread] = React.useState<any>(null);
	const [nameImage, setNameImage] = React.useState<AbstractPictureKeys>('ballSplit');
	const [rebuild, setRebuild] = React.useState<number>(1);

	// const createAndEditJob = async (job: Ijob) => {
	// 	job.user_create = userData.id;
	// 	job.CNPJ_company = userData.cnpj;
	// 	job.time = JSON.stringify({
	// 		time: job.time,
	// 		journey: job.journey,
	// 	});
	// 	if (editItem && 'id' in editItem) {
	// 		const update: IjobUpdate = job;
	// 		update.user_edit = userData.id;
	// 		const response = await JobUpdate(update, editItem.id);
	// 		switch (response.status) {
	// 			case 200:
	// 				setRebuild(rebuild + 1);
	// 				toast(
	// 					<Toasts icon='Work' iconColor='success' title='Successo'>
	// 						Vaga editada com sucesso!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				setEditPanel(false);
	// 				break;
	// 			case 404:
	// 				toast(
	// 					<Toasts icon='Work' iconColor='danger' title='Erro'>
	// 						Algo deu errado, tente novamente!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				break;
	// 			case 500:
	// 				toast(
	// 					<Toasts icon='Work' iconColor='warning' title='Erro'>
	// 						Erro interno, tente novamente!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				break;
	// 			default:
	// 				toast(
	// 					<Toasts icon='Work' iconColor='danger' title='Erro Desconhecido'>
	// 						Algo deu errado, tente novamente!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				break;
	// 		}
	// 	} else {
	// 		const response = await Job(job);
	// 		switch (response.status) {
	// 			case 201:
	// 				setRebuild(rebuild + 1);
	// 				toast(
	// 					<Toasts icon='Work' iconColor='success' title='Successo'>
	// 						Vaga criada com sucesso!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				setEditPanel(false);
	// 				break;
	// 			case 500:
	// 				toast(
	// 					<Toasts icon='Work' iconColor='warning' title='Erro'>
	// 						Algo deu errado, tente novamente!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				break;
	// 			default:
	// 				toast(
	// 					<Toasts icon='Work' iconColor='danger' title='Erro Desconhecido'>
	// 						Algo deu errado, tente novamente!
	// 					</Toasts>,
	// 					{ closeButton: true, autoClose: 1000 },
	// 				);
	// 				break;
	// 		}
	// 	}
	// };

	const validate = (values: IValues) => {
		const errors: any = {};

		// Validações para campos obrigatórios
		if (!values.function) {
			errors.function = 'Função é obrigatória';
		}
		if (!values.salary || values.salary <= 0) {
			errors.salary = 'Salário deve ser maior que zero';
		}
		if (!values.model) {
			errors.model = 'Modelo de trabalho é obrigatório';
		}
		if (!values.contract) {
			errors.contract = 'Tipo de contratação é obrigatório';
		}
		if (!values.cep) {
			errors.cep = 'CEP é obrigatório';
		} else if (!/^\d{5}-?\d{3}$/.test(values.cep)) {
			errors.cep = 'CEP deve estar no formato 12345-678';
		}
		if (!values.locality) {
			errors.locality = 'Localidade é obrigatório';
		}
		if (!values.requirements) {
			errors.requirements = 'Responsabilidade é obrigatório';
		}
		if (!values.responsibility) {
			errors.responsibility = 'Responsabilidade é obrigatório';
		}

		return errors;
	};

	const sendMessageRecruit = async () => {
		setLoaderRecruit(true); // Ativa o loader

		return new Promise(async (resolve, reject) => {
			try {
				const RecruitProps = {
					thread: null,
					message: formik.values.function,
				};

				const response = await RecruitAutoComplet(RecruitProps);
				if (response && response?.status === 200) {
					const informations = JSON.parse(response.response);

					const updatedValues = {
						...formik.values, // Mantém os valores atuais
						requirements: informations.requirements, // Atualiza 'requirements'
						responsibility: informations.responsibility, // Atualiza 'responsibility'
					};

					formik.setValues(updatedValues); // Atualiza os valores no Formik
					setLoaderRecruit(false); // Desativa o loader
					setInitial(true);
					resolve(''); // Resolve a Promise após atualizar os valores
				} else {
					setLoaderRecruit(false); // Desativa o loader em caso de erro
					reject('Erro na resposta'); // Rejeita a Promise caso algo dê errado
				}
			} catch (error: any) {
				setLoaderRecruit(false); // Desativa o loader em caso de erro
				reject('Erro ao enviar a mensagem: ' + error.message); // Rejeita a Promise com o erro
			}
		});
	};

	const findCep = async () => {
		const response = await FindCep(formik.values.cep.replace(/\D/g, ''));
		if(response && response.erro){
			toast(
				<Toasts
					icon='Close'
					iconColor='danger'
					title='Atenção'>
					Endereço não Encontrado
				</Toasts>,
				{ closeButton: true, autoClose: 1000 },
			);
			return
		}
		const updatedValues = {
			...formik.values, // Mantém os valores atuais
			locality:`${response.estado}, ${response.localidade}`
		};
		formik.setValues(updatedValues);
	};

	const formik = useFormik({
		initialValues: {
			function: '',
			PCD: '0',
			DEI: '0',
			salary: '',
			locality:'',
			model: '',
			contract: '',
			requirements: '',
			responsibility: '',
			cep: '',
			image: '',
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			values.image = nameImage;
			const job = values;
			// createAndEditJob(job);
			if (!editItem) {
				resetForm();
			}
		},
	});

	React.useEffect(() => {
		if (decision == 'ia') {
			sendMessageRecruit();
		}
	}, [decision]);

	return (
		<PageWrapper title={secondaryPath.vacanciesCreate.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						homePath='/recruit/home'
						list={[
							{
								to: mainMenu.recruit.subMenu.job.path,
								title: 'Gerar Vaga',
							},
						]}
					/>
					<SubheaderSeparator />
				</SubHeaderLeft>
			</SubHeader>
			<div className='flex row p-4 g-4 d-flex align-items-stretch'>
				<div className='col-4 h-100'>
					<Card className='h-50'>
						<CardHeader>
							<CardLabel icon='robot' iconColor='success'>
								<CardTitle>Assistente IA (Beta)</CardTitle>
							</CardLabel>
							{IAactive && (
								<CardTitle>
									<Checks
										isInline
										type={'switch'}
										label={'Ativar'}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											const isChecked = event.target.checked;
											setIAactive(isChecked);
										}}
										checked={IAactive}
									/>
								</CardTitle>
							)}
						</CardHeader>
						{!IAactive ? (
							<CardBody>
								<>
									<div className='d-flex flex-column items-center justify-content-center'>
										Ative e deixe que a gente te ajude a encontrar a pessoa
										certa.
										<p className='text-muted small'>
											Vamos te ajudar a preencher a vaga
										</p>
									</div>
									<div className='mt-2'>
										<Checks
											isInline
											type={'switch'}
											label={'Ativar'}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>,
											) => {
												if (!initial) {
													toast(
														<Toasts
															icon='Close'
															iconColor='danger'
															title='Atenção'>
															Primeiro selecione como gostaria de
															gerar a vaga
														</Toasts>,
														{ closeButton: true, autoClose: 2000 },
													);
													return;
												}
												const isChecked = event.target.checked;
												setIAactive(isChecked);
											}}
											checked={IAactive}
										/>
									</div>
								</>
							</CardBody>
						) : (
							<Chat
								formik={formik}
								sendFunction={sendFunction}
								userData={userData}
								thread={IAthread}
								setThread={setIAthread}
							/>
						)}
					</Card>

					<Card>
						<CardHeader>
							<CardLabel icon='LibraryAdd' iconColor='success'>
								<CardTitle>Criador da Vaga</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='d-flex flex-column items-center justify-content-center'>
								<div className='d-flex items-center justify-content-center h-50'>
									<Avatar
										className='bg-secondary'
										src={
											(userData && userData.avatar)
												? // @ts-ignore
													AvatarPicture[userData.avatar] // Se o usuário selecionou um avatar, exiba-o
												: userData.avatar
													? // @ts-ignore
														AvatarPicture[userData.avatar] // Caso contrário, exiba o avatar do usuário (se disponível)
													: AvatarPicture.default // Caso contrário, exiba o avatar padrão
										}
										color='storybook'
										rounded={'circle'}
									/>
								</div>

								<div className='mt-3'>
									<div className='d-flex align-items-center mb-2'>
										<Icon icon='person' size='2x' />
										<p className='ms-2 mb-0 text-capitalize'>
											{userData && userData.name}
										</p>
									</div>
									<div className='d-flex align-items-center mb-2'>
										<Icon icon='email' size='2x' />
										<p className='ms-2 mb-0'>{userData && userData.email}</p>
									</div>
									<div className='d-flex align-items-center mb-2'>
										<Icon icon='phone' size='2x' />
										<p className='ms-2 mb-0'>
											{userData && Mask('phone', userData.phone)}
										</p>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
				<div className='col-8'>
					<Card>
						<CardHeader>
							<CardLabel icon='Description' iconColor='success'>
								<CardTitle>Informações da Vaga</CardTitle>
							</CardLabel>
						</CardHeader>

						{initial ? (
							<CardBody>
								{formik && (
									<FormJob
										setInitial={setInitial}
										formik={formik}
										setIAactive={setIAactive}
										userData={userData}
									/>
								)}
							</CardBody>
						) : (
							<CardBody>
								{sendFunction && formik ? (
									<SelectOptionJob
										setSendFunction={setSendFunction}
										setDecision={setDecision}
										setInitial={setInitial}
										loader={loaderRecruit}
									/>
								) : (
									<SendFunction formik={formik} setFinish={setSendFunction} />
								)}
							</CardBody>
						)}
					</Card>
				</div>
			</div>
		</PageWrapper>
	);
}
