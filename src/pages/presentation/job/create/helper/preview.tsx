import React, { useEffect } from 'react';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../../../../components/bootstrap/Modal';
import Button from '../../../../../components/bootstrap/Button';
import Icon from '../../../../../components/icon/Icon';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';
import FindCep from '../../../../../api/get/Cep';
import { toast } from 'react-toastify';
import Toasts from '../../../../../components/bootstrap/Toasts';
import { AbstractPicture } from '../../../../../constants/abstract';
import Job from '../../../../../api/post/Job';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../../../components/bootstrap/Spinner';
import Mask from '../../../../../function/Mask';

type PreviewProps = {
	formik: any;
	skills: any[];
	benefit: any[];
	setPreview: any;
	preview: any;
	userData: any;
};
export default function Preview({
	formik,
	skills,
	benefit,
	preview,
	setPreview,
	userData,
}: PreviewProps) {
	const [duplicate, setDuplicate] = React.useState<boolean>(false);
	const [showDuplicate, setShowDuplicate] = React.useState<boolean>(false);
	const [localities, setLocalities] = React.useState([]);
	const [load, setLoad] = React.useState<boolean>(false);
	const navigate = useNavigate();

	const handleChange = (index: number, field: string, value: string) => {
		const updated = [...localities];
		updated[index][field] = value;
		setLocalities(updated);
	};

	const handleCepChange = (index: number, value: string) => {
		const updated = [...localities];
		updated[index].cep = value;
		setLocalities(updated);

		// Quando atingir 9 caracteres (com máscara), chama findCep
		if (value.replace(/\D/g, '').length === 8) {
			findCep(value, index);
		}
	};

	const addLocality = () => {
		setLocalities([...localities, { cep: '', locality: '' }]);
	};

	const removeLocality = (index: number) => {
		const updated = [...localities];
		updated.splice(index, 1);
		setLocalities(updated);
	};

	const findCep = async (cep: string, index: number) => {
		const response = await FindCep(cep);
		if (response && response.erro) {
			toast(
				<Toasts icon='Close' iconColor='danger' title='Atenção'>
					Endereço não Encontrado
				</Toasts>,
				{ closeButton: true, autoClose: 1000 },
			);
			return;
		}

		const updated = [...localities];
		updated[index].locality = `${response.estado}, ${response.localidade}`;
		setLocalities(updated);
	};

	const getRandomImage = () => {
		const keys = Object.keys(AbstractPicture) as Array<keyof typeof AbstractPicture>; // Defina o tipo correto das chaves
		const randomKey = keys[Math.floor(Math.random() * keys.length)]; // Escolhe uma chave aleatória
		formik.setFieldValue('image', randomKey);
		return AbstractPicture[randomKey]; // Retorna a imagem correspondente à chave aleatória
	};

	const saveJob = () => {
		return new Promise(async (resolve, reject) => {
			try {
				setLoad(true)
				const PropsCreateJob = {
					default: formik.values,
					benefits: benefit,
					skills: skills,
					localities: localities,
					user_create: userData.id,
					CNPJ_company: userData.cnpj,
				};

				const response = await Job(PropsCreateJob);

				if (response.status == 201) {
					toast(
						<Toasts icon='Check' iconColor='success' title='Sucesso'>
							Vagas Criadas com sucesso
						</Toasts>,
						{ closeButton: true, autoClose: 1000 },
					);
					setTimeout(() => {
						navigate('/recruit/vacancies');
						resolve(true);
						setLoad(false)
					}, 1000);
				} else {
					toast(
						<Toasts icon='Close' iconColor='danger' title='Atenção'>
							Não conseguimos gerar a vaga, tente mais tarde!
						</Toasts>,
						{ closeButton: true, autoClose: 2000 },
					);
					setLoad(false)
					resolve(false);
				}
			} catch (e) {
				reject(e);
			}
		});
	};

	const formatMoney = (value: string) => {
		if (!value) return '';

		// Remove tudo que não for número
		let cleaned = value.replace(/\D/g, '');

		// Se for vazio, retorna R$ 0,00
		if (cleaned.length === 0) return 'R$ 0,00';

		// Converte para número e força no formato de centavos
		const numberValue = parseInt(cleaned, 10);

		// Divide por 100 para colocar centavos
		const floatValue = numberValue / 100;

		// Formata com padrão brasileiro (pt-BR)
		return floatValue.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});
	};

	useEffect(() => {
		getRandomImage();
	}, []);

	return (
		<Modal isStaticBackdrop={load} isOpen={preview} setIsOpen={setPreview} size='lg'>
			<ModalHeader
				setIsOpen={load ? null : setPreview}
				className='d-flex justify-content-between'>
				<h2>{duplicate ? 'Duplicação' : 'Preview'}</h2>
			</ModalHeader>
			<ModalBody>
				{duplicate ? (
					<>
						<div className='row g-2 items-center justify-content-center items-align-center mb-3'>
							<div className='col-2'>
								<FormGroup id='cep' label='CEP' isFloating>
									<Input
										disabled
										placeholder='CEP'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.cep}
										mask='99999-999'
										isValid={formik.isValid}
										isTouched={formik.touched.cep}
										invalidFeedback={formik.errors.cep}
										validFeedback='Ótimo!'
									/>
								</FormGroup>
							</div>
							<div className='col-9'>
								<FormGroup id='locality' label='Localidade' isFloating>
									<Input
										disabled
										placeholder='Localidade'
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.locality}
										isValid={formik.isValid}
										isTouched={formik.touched.locality}
										invalidFeedback={formik.errors.locality}
										validFeedback='Ótimo!'
									/>
								</FormGroup>
							</div>
							<Button
								isLink
								color='success'
								icon='AddCircle'
								size='lg'
								onClick={addLocality}
							/>
						</div>
						{localities.map((item, index) => (
							<div
								key={index}
								className='row g-2 items-center justify-content-center items-align-center mb-3'>
								<div className='col-2'>
									<FormGroup id={`cep-${index}`} label='CEP' isFloating>
										<Input
											placeholder='CEP'
											name={`cep-${index}`}
											value={item.cep}
											onChange={(e: any) =>
												// handleChange(index, 'cep', e.target.value)
												handleCepChange(index, e.target.value)
											}
											mask='99999-999'
										/>
									</FormGroup>
								</div>
								<div className='col-9'>
									<FormGroup
										id={`locality-${index}`}
										label='Localidade'
										isFloating>
										<Input
											placeholder='Localidade'
											name={`locality-${index}`}
											value={item.locality}
											onChange={(e: any) =>
												handleChange(index, 'locality', e.target.value)
											}
										/>
									</FormGroup>
								</div>
								<Button
									icon='RemoveCircle'
									size='lg'
									color='danger'
									isLink
									onClick={() => removeLocality(index)}
								/>
							</div>
						))}
					</>
				) : (
					<section className='p-4 border rounded'>
						<div className='d-flex justify-content-between mb-3'>
							<h4>{formik.values.function}</h4>
							<h4>{ formatMoney(formik.values.salary)}</h4>
						</div>

						<div className='d-flex gap-5 mb-3'>
							<div className='d-flex justify-content-center align-items-center'>
								<Icon
									color='success'
									style={{ marginRight: '1%', userSelect: 'none' }}
									icon='Accessible'
									size={'2x'}
								/>
								<strong>PCD: </strong> {formik.values.PCD === '1' ? 'Sim' : 'Não'}
							</div>
							<div className='d-flex justify-content-center align-items-center'>
								<Icon
									color='success'
									style={{ marginRight: '1%', userSelect: 'none' }}
									icon='Dei'
									size={'2x'}
								/>
								<strong>DEI: </strong> {formik.values.DEI === '1' ? 'Sim' : 'Não'}
							</div>
						</div>

						<div className='mb-3'>
							<strong>Modelo de Trabalho:</strong>{' '}
							{formik.values.model || 'Não informado'}
						</div>

						<div className='mb-3'>
							<strong>Tipo de Contratação:</strong>{' '}
							{formik.values.contract || 'Não informado'}
						</div>

						<div className='mb-3'>
							<strong>CEP:</strong> {formik.values.cep || 'Não informado'}
						</div>

						<div className='mb-3'>
							<strong>Localidade:</strong> {formik.values.locality || 'Não informado'}
						</div>

						{localities && localities.length > 0 && (
							<div className='mb-3'>
								<Button
									color='success'
									isLink
									icon={
										showDuplicate ? 'KeyboardArrowDown' : 'KeyboardArrowRight'
									}
									onClick={() => setShowDuplicate(!showDuplicate)}>
									Duplicados
								</Button>

								{showDuplicate &&
									localities.map((item, index) => (
										<div className='d-flex gap-2' key={index}>
											<p>
												<strong>CEP:</strong> {item.cep}
											</p>
											<p>
												<strong>Localidade:</strong> {item.locality}
											</p>
										</div>
									))}
							</div>
						)}

						<div className='mb-3'>
							<strong>Responsabilidades:</strong>
							<p>{formik.values.responsibility || 'Não informado'}</p>
						</div>

						<div className='mb-3'>
							<strong>Requisitos:</strong>
							<p>{formik.values.requirements || 'Não informado'}</p>
						</div>

						<div className='mb-3'>
							<Icon
								color='success'
								style={{ marginRight: '1%', userSelect: 'none' }}
								icon='Lightbulb'
								size={'2x'}
							/>
							<strong>Competências:</strong>
							<div className='d-flex flex-wrap gap-2 mt-2'>
								{skills.length > 0 ? (
									skills.map((skill) => (
										<span
											key={skill.id}
											className='p-2 bg-primary rounded fw-bold text-white'>
											{skill.name}
										</span>
									))
								) : (
									<span className='text-muted'>
										Nenhuma competência adicionada
									</span>
								)}
							</div>
						</div>

						<div className='mb-3'>
							<Icon
								color='success'
								style={{ marginRight: '1%', userSelect: 'none' }}
								icon='CardGiftcard'
								size={'2x'}
							/>
							<strong>Benefícios:</strong>
							<div className='d-flex flex-wrap gap-2 mt-2'>
								{benefit.filter((b) => b.active).length > 0 ? (
									benefit
										.filter((b) => b.active)
										.map((b) => (
											<Button
												isOutline
												color={'primary'}
												isLink={b.active}
												icon={b.icon}
												className='text-capitalize'>
												{b.name}
											</Button>
										))
								) : (
									<span className='text-muted'>Nenhum benefício selecionado</span>
								)}
							</div>
						</div>
					</section>
				)}
			</ModalBody>

			<ModalFooter>
				{!load && (
					<Button
						icon={duplicate ? 'ArrowBack' : 'ControlPointDuplicate'}
						color={'info'}
						isLink
						onClick={() => {
							if (duplicate && localities && localities.length > 0) {
								const isInvalid = (item: any) =>
									!item?.cep || item.cep.length !== 9 || !item?.locality;
							
								const cleaned = localities.filter(item => !isInvalid(item));
							
								// Atualiza apenas se algo foi removido
								if (cleaned.length !== localities.length) {
									setLocalities(cleaned);
								} else {
									// Adiciona novo item em branco (não duplica o último!)
									// setLocalities([...localities, { cep: '', locality: '' }]);
								}
							}

							setDuplicate(!duplicate);
						}}>
						{duplicate ? 'Voltar' : 'Duplicar'}
					</Button>
				)}

				{load ? (
					<Spinner size={20} />
				) : (
					!duplicate && 
					<Button icon='save' color='success' isLight onClick={saveJob}>
						Salvar
					</Button>
				)}
			</ModalFooter>
		</Modal>
	);
}
