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
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Icon from '../../../../components/icon/Icon';
type AbstractPictureKeys = keyof typeof AbstractPicture;
interface Ijob {
	user_create?: any;
	image: string;
	PCD: string;
	function: string;
	salary: any;
	time: any;
	journey: string;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	CNPJ_company?: string;
}
interface IjobUpdate {
	image: string;
	function: string;
	PCD: string;
	salary: any;
	journey: any;
	time: any;
	contract: string;
	benefits: string;
	details: string;
	obligations: string;
	user_edit?: string;
}

export default function CreateJob() {
	const { userData } = React.useContext(AuthContext);
	const [data, setData] = React.useState<any>(null);
	const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
	const [editItem, setEditItem] = React.useState<IValues | null>(null);
	const [editPanel, setEditPanel] = React.useState<boolean>(false);
	const [imageFile, setImageFile] = React.useState<any>(null);
	const [nameImage, setNameImage] = React.useState<AbstractPictureKeys>('ballSplit');
	const [rebuild, setRebuild] = React.useState<number>(1);

	const createAndEditJob = async (job: Ijob) => {
		job.user_create = userData.id;
		job.CNPJ_company = userData.cnpj;
		job.time = JSON.stringify({
			time: job.time,
			journey: job.journey,
		});
		if (editItem && 'id' in editItem) {
			const update: IjobUpdate = job;
			update.user_edit = userData.id;
			delete update.journey;
			const response = await JobUpdate(update, editItem.id);
			switch (response.status) {
				case 200:
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon='Work'
							iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Successo'>
							Vaga editada com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					setEditPanel(false);
					break;
				case 404:
					toast(
						<Toasts
							icon='Work'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro'>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
				case 500:
					toast(
						<Toasts
							icon='Work'
							iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro'>
							Erro interno, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
				default:
					toast(
						<Toasts
							icon='Work'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro Desconhecido'>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
			}
		} else {
			const response = await Job(job);
			switch (response.status) {
				case 201:
					setRebuild(rebuild + 1);
					toast(
						<Toasts
							icon='Work'
							iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Successo'>
							Vaga criada com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					setEditPanel(false);
					break;
				case 500:
					toast(
						<Toasts
							icon='Work'
							iconColor='warning' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro'>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;

				default:
					toast(
						<Toasts
							icon='Work'
							iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title='Erro Desconhecido'>
							Algo deu errado, tente novamente!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 1000, // Examples: 1000, 3000, ...
						},
					);
					break;
			}
		}
	};

	interface IValues {
		image: any;
		PCD: string;
		function: string;
		salary: any;
		time: any;
		journey: string;
		contract: string;
		benefits: string;
		details: string;
		obligations: string;
	}

	const validate = (values: IValues) => {
		const errors: any = {};
		// Campos obrigatórios

		if (!values.function) {
			errors.function = 'Função é obrigatória';
		}
		if (!values.salary || values.salary <= 0) {
			errors.salary = 'Salário é obrigatório';
		}
		if (!values.time || values.time <= 0) {
			errors.time = 'Horas semanais são obrigatórias';
		} else if (values.time.length < 1) {
			errors.time = 'Horário mínimo é 1 digito';
		} else if (values.time.length > 3) {
			errors.time = 'Horário máximo é 3 digitos';
		}
		if (!values.journey) {
			errors.journey = 'Jornada é obrigatória';
		}
		if (!values.contract) {
			errors.contract = 'Contrato é obrigatório';
		}

		// Não validamos os campos opcionais (benefits, details, obligations)

		return errors;
	};

	const formik = useFormik({
		initialValues: {
			function: '',
			PCD: '0',
			salary: '',
			time: '',
			journey: '',
			contract: '',
			benefits: '',
			details: '',
			obligations: '',
			image: '',
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			values.image = nameImage;
			const job = values;
			createAndEditJob(job);
			if (!editItem) {
				resetForm();
			}
			// setEditPanel(false); // Se você quiser desativar o painel de edição, mantenha essa linha
		},
	});

	React.useEffect(() => {}, [userData]);

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
					{/* {data && <span className='text-muted'>{data.length} vagas abertas</span>} */}
				</SubHeaderLeft>
				{/* <SubHeaderRight>
					<Button
						color='dark'
						isLight
						icon='Add'
						onClick={() => {
							setEditItem(null);
							setEditPanel(true);
						}}>
						Gerar Vaga
					</Button>
				</SubHeaderRight> */}
			</SubHeader>
			<div className='p-5'>
				<Card>
					<CardHeader>
						<CardLabel icon='Description' iconColor='success'>
							<CardTitle>Detalhes da Vaga</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody>
						<div className='row g-4'>
							<div className='col-2 d-flex align-items-center'>
                                <Icon
									icon={'Accessible'}
									color={'success'}
                                    size={'2x'}
						        />
								<div className='ms-2'>
									<Checks
										isInline
										type={'switch'}
										label={'PCD'}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											const isChecked = event.target.checked;
											formik.setFieldValue('PCD', isChecked ? '1' : '0');
										}}
										checked={formik.values.PCD == '1' ? true : false}
									/>
								</div>
							</div>
							
                            <div className='col-2 d-flex align-items-center'>
								<Icon
									icon={'Dei'}
									color={'success'}
                                    size={'2x'}
						        />
                                <div className='ms-2'>
                                    <Checks
                                        isInline
                                        type={'switch'}
                                        label={'DEI'}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            const isChecked = event.target.checked;
                                            formik.setFieldValue('PCD', isChecked ? '1' : '0');
                                        }}
                                        checked={formik.values.PCD == '1' ? true : false}
                                    />
                                </div>
							</div>

							<div className='row g-2'>
								<div className='col-8'>
									<FormGroup id='function' label='Função' isFloating>
										<Input
											className='text-capitalize'
											placeholder='Função'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.function}
											isValid={formik.isValid}
											isTouched={formik.touched.function}
											invalidFeedback={formik.errors.function}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
								<div className='col-4'>
									<FormGroup id='salary' label='Salário' isFloating>
										<Input
											type='number'
											onChange={formik.handleChange}
											value={formik.values.salary}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.salary}
											invalidFeedback={formik.errors.salary}
											validFeedback='Ótimo!'
										/>
									</FormGroup>
								</div>
							</div>

                            <div className='row g-2'>
                                <div className='col-6'>
                                    <FormGroup id='journey'>
                                        <Select
                                            className='form-select fw-medium'
                                            required={true}
                                            ariaLabel={''}
                                            placeholder={'Modelo de Trabalho'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.journey}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.journey}
                                            invalidFeedback={formik.errors.journey}
                                            validFeedback='Ótimo!'>
                                            <option value={'5x2'}>Presencial</option>
                                            <option value={'5x2'}>Híbrido</option>
                                            <option value={'6x1'}>Home Office</option>
                                        </Select>
                                    </FormGroup>
                                </div>
                                <div className='col-6'>
                                    <FormGroup id='contract'>
                                        <Select
                                            className='form-select fw-medium'
                                            required={true}
                                            ariaLabel={'Contratação'}
                                            placeholder={'Contratação'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.contract}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.contract}
                                            invalidFeedback={formik.errors.contract}
                                            validFeedback='Ótimo!'>
                                            <Option value={'clt'}>CLT</Option>
                                            <Option value={'pj'}>PJ </Option>
                                            <Option value={'contract'}>Contrato</Option>
                                        </Select>
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='row g-2'>
                                <div className='col-2'>
                                    <FormGroup id='time' label='CEP' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='CEP'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-10'>
                                    <FormGroup id='time' label='Logradouro' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='Horas semanais'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='row g-2'>
                                <div className='col-1'>
                                    <FormGroup id='time' label='UF' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='UF'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-4'>
                                    <FormGroup id='time' label='Bairro' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='UF'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-2'>
                                    <FormGroup id='time' label='Número' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='CEP'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-5'>
                                    <FormGroup id='time' label='UF' isFloating>
                                        <Input
                                            max={3}
                                            min={1}
                                            placeholder='UF'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.time}
                                            isValid={formik.isValid}
                                            isTouched={formik.touched.time}
                                            invalidFeedback={formik.errors.time}
                                            validFeedback='Ótimo!'
                                        />
                                    </FormGroup>
                                </div>
                            </div>


							<div className='col-6'>
								<FormGroup id='journey'>
									<Select
										className='form-select fw-medium'
										required={true}
										ariaLabel={''}
										placeholder={'Jornada'}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.journey}
										isValid={formik.isValid}
										isTouched={formik.touched.journey}
										invalidFeedback={formik.errors.journey}
										validFeedback='Ótimo!'>
										<option value={'5x2'}>5x2</option>
										<option value={'6x1'}>6x1</option>
									</Select>
								</FormGroup>
							</div>
							<div className='col-6'>
								<FormGroup id='contract'>
									<Select
										className='form-select fw-medium'
										required={true}
										ariaLabel={'Contratação'}
										placeholder={'Contratação'}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.contract}
										isValid={formik.isValid}
										isTouched={formik.touched.contract}
										invalidFeedback={formik.errors.contract}
										validFeedback='Ótimo!'>
										<Option value={'clt'}>CLT</Option>
										<Option value={'pj'}>PJ </Option>
										<Option value={'contract'}>Contrato</Option>
									</Select>
								</FormGroup>
							</div>

							<div className='col-12'>
								<FormGroup
									id='obligations'
									label='Obrigações (opcional)'
									isFloating>
									<Textarea
										onChange={formik.handleChange}
										value={formik.values.obligations}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.obligations}
										invalidFeedback={formik.errors.obligations}
										validFeedback='Ótimo!'></Textarea>
								</FormGroup>
							</div>
							<div className='col-12'>
								<FormGroup id='benefits' label='Benefícios (opcional)' isFloating>
									<Textarea
										onChange={formik.handleChange}
										value={formik.values.benefits}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.benefits}
										invalidFeedback={formik.errors.benefits}
										validFeedback='Ótimo!'></Textarea>
								</FormGroup>
							</div>
							<div className='col-12'>
								<FormGroup id='details' label='Detalhes (opcional)' isFloating>
									<Textarea
										onChange={formik.handleChange}
										value={formik.values.details}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.details}
										invalidFeedback={formik.errors.details}
										validFeedback='Ótimo!'></Textarea>
								</FormGroup>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</PageWrapper>
	);
}
