import React, { useContext, useEffect, useState } from 'react';
// @ts-ignore
import ReactCreditCards, { Focused } from 'react-credit-cards-2';
import Payment from 'payment';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import ReactCreditCardsContainer from '../../../components/extras/ReactCreditCardsContainer';
import useDarkMode from '../../../hooks/useDarkMode';
import HumanShield from '../../../assets/humans/shield.png';
import Spinner from '../../../components/bootstrap/Spinner';
import Card_Company from '../../../api/post/card_company/create';
import AuthContext from '../../../contexts/authContext';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';
import AllCardCompany from '../../../api/get/card_company/AllCardCompany';
import PatchCardCompanyDefault from '../../../api/patch/card_company/Default';
import DeleteCardCompany from '../../../api/delete/card_company/default';
const validate = (values: {
	name: string;
	number: string;
	cvc: number | string;
	expiry: string;
}) => {
	const errors: Record<string, string> = {};

	if (!values.name) {
		errors.name = 'Obrigatório';
	} else if (values.name.length < 7) {
		errors.name = 'Deve ter 7 caracteres ou mais';
	} else if (!values.name.includes(' ')) {
		errors.name = 'Deve conter nome e sobrenome';
	}

	if (!values.number || values.number.includes('_')) {
		errors.number = 'Obrigatório';
	} else if (!Payment.fns.validateCardNumber(values.number)) {
		errors.number = 'Número de cartão inválido';
	}

	if (!values.cvc) {
		errors.cvc = 'Obrigatório';
	} else if (values.cvc.toString().length !== 3) {
		errors.cvc = 'Deve ter 3 números';
	}

	//# Antiga validação
	// if (!values.expiry || values.expiry.includes('_')) {
	// 	errors.expiry = 'Obrigatório';
	// } else if (parseInt(values.expiry.slice(-2), 10) <= 20) {
	// 	errors.expiry = 'Data de validade inválida';
	// }

	//# Nova validação para validar a data de validade
	const [month, year] = values.expiry.split('/').map(Number);
	const currentYear = new Date().getFullYear() % 100; // Pegamos os últimos dois dígitos do ano
	const currentMonth = new Date().getMonth() + 1; // Janeiro é 0, então somamos 1

	if (
		isNaN(month) ||
		isNaN(year) || // Garante que month e year sejam números válidos
		month < 1 ||
		month > 12 || // Mês deve estar entre 1 e 12
		year < currentYear || // Ano não pode estar no passado
		(year === currentYear && month < currentMonth) // Se for o mesmo ano, o mês não pode estar no passado
	) {
		errors.expiry = 'Data de validade inválida';
	}

	return errors;
};

const CompanyWallet = () => {
	const { darkModeStatus } = useDarkMode();

	// const [cardList, setCardList] = useState<
	// 	{ id: number; name: string; number: string; expiry: string; cvc: number | string }[]
	// >([
	// 	{
	// 		id: 1,
	// 		name: 'John Doe',
	// 		number: '4134 1111 1111 1134',
	// 		expiry: '12/21',
	// 		cvc: 123,
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'John Doe',
	// 		number: '5534 1111 1111 1198',
	// 		expiry: '12/24',
	// 		cvc: 234,
	// 	},
	// 	{
	// 		id: 3,
	// 		name: 'John Doe',
	// 		number: '3700 000000 00002',
	// 		expiry: '12/24',
	// 		cvc: 234,
	// 	},
	// ]);
	const { userData } = useContext(AuthContext);
	const [cardList, setCardList] = useState<
		{ id: number; name: string; number: string; expiry: string; cvc: number | string }[]
	>([]);
	const [actionCard, setActionCard] = useState<any>(null);
	const [selectedCardId, setSelectedCardId] = useState<number>(2);
	const [modalStatus, setModalStatus] = useState<boolean>(false);
	const [modalDelete, setModalDelete] = useState<boolean>(false);
	const selectedCard = cardList.find((f) => f.id === selectedCardId);
	const [focused, setFocused] = useState<Focused>('number');
	const [waiting, setWaiting] = useState<boolean>(false);
	const handleInputFocus = ({ target }: { target: { name: Focused } }) => setFocused(target.name);
	const formik = useFormik({
		initialValues: {
			name: '',
			number: '',
			expiry: '',
			cvc: '',
		},
		validate,
		onSubmit: (values) => {
			saveCard(values);
		},
	});

	const saveCard = async (values: {
		name: string;
		number: string;
		cvc: number | string;
		expiry: string;
	}) => {
		setWaiting(true);

		if (actionCard === 'add') {
			values.number = values.number.replace(/\s/g, '');
			values.cvc = values.cvc.toString();
			const props = {
				name: values.name,
				number: values.number,
				cvc: values.cvc,
				expiry: values.expiry,
				CNPJ: userData.cnpj,
				user_create: userData.id,
			};
			const response = await Card_Company(props);
			if (response.status === 201) {
				toast(
					<Toasts
						icon={'Check'}
						iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'🥳 Parabéns! '}>
						Cartão adicionado com sucesso.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 4000, //
					},
				);
				setModalStatus(false);
				setCardList([...cardList, response.data]);
			} else {
				toast(
					<Toasts
						icon={'Close'}
						iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'Erro'}>
						Erro ao adicionar cartão, tente novamente.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 4000, //
					},
				);
			}
			setWaiting(false);
			formik.resetForm();
			setModalStatus(false);
		} else if (actionCard === 'edit' && selectedCard) {
			values.number = values.number.replace(/\s/g, '');
			values.cvc = values.cvc.toString();
			const props = {
				name: values.name,
				number: values.number,
				cvc: values.cvc,
				expiry: values.expiry,
				CNPJ: userData.cnpj,
				user_update: userData.id,
			};
			const response = await PatchCardCompanyDefault(props, selectedCard.id);
			if (response.status === 200) {
				setCardList(
					cardList.map((card) => (card.id === selectedCard.id ? response.data : card)),
				);
				toast(
					<Toasts icon={'Check'} iconColor={'success'} title={'🥳 Parabéns! '}>
						Cartão editado com sucesso.
					</Toasts>,
				);
				setModalStatus(false);
			} else {
				toast(
					<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
						Erro ao editar cartão, tente novamente.
					</Toasts>,
				);
			}
			setWaiting(false);
		} else if (actionCard === 'delete' && selectedCard) {
			deleteCard(selectedCard);
		}
	};

	const editCard = async (selectedCard: any) => {
		if (selectedCard) {
			setModalStatus(true);
			setSelectedCardId(selectedCard.id);
			formik.setValues({
				name: selectedCard.name,
				number: selectedCard.number,
				expiry: selectedCard.expiry,
				cvc: '',
			});
		} else {
			console.error('Cartão selecionado não encontrado.');
		}
	};

	const deleteCard = async (selectedCard: any) => {
		const response = await DeleteCardCompany(selectedCard.id);
		if (response.status === 200) {
			setCardList(cardList.filter((card) => card.id !== selectedCard.id));
			setModalDelete(false);
			toast(
				<Toasts icon={'Check'} iconColor={'success'} title={'🥳 Parabéns! '}>
					Cartão excluído com sucesso.
				</Toasts>,
			);
		} else {
			toast(
				<Toasts icon={'Close'} iconColor={'danger'} title={'Erro'}>
					Erro ao excluir cartão, tente novamente.
				</Toasts>,
			);
		}
	};


	useEffect(() => {
		if (userData) {
			const fetchData = async () => {
				const response = await AllCardCompany(userData.cnpj);
				console.log(response.data);
				if (response.status === 200) {
					setCardList(response.data);
				}
			};
			fetchData();
		}
	}, [userData]);

	return (
		<>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='Style' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							Carteira
						</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='info'
							icon='CreditCard'
							isLight
							onClick={() => {
								setActionCard('add');
								formik.resetForm();
								setModalStatus(true);
							}}>
							Adicionar Cartão
						</Button>
					</CardActions>
				</CardHeader>

				<CardBody>
					<div className='row g-3'>
						<div className='col-12'>
							{selectedCard && (
								<>
									<div className='d-flex justify-content-end'>
										<div className='d-flex gap-2'>
											<Button
												color='warning'
												icon='Edit'
												isLink={true}
												onClick={() => {
													setActionCard('edit');
													editCard(selectedCard);
												}}></Button>

											<Button
												color='danger'
												icon='Delete'
												isLink={true}
												onClick={() => {
													setActionCard('delete');
													setModalDelete(true);
												}}></Button>
										</div>
									</div>
									<ReactCreditCardsContainer
										issuer={Payment.fns.cardType(selectedCard.number)}>
										<ReactCreditCards
											cvc={selectedCard.cvc}
											expiry={selectedCard.expiry}
											name={selectedCard.name}
											number={selectedCard.number.replace(
												/\d(?!(\d*)$)/g,
												'*',
											)}
											preview
											issuer={Payment.fns.cardType(selectedCard.number)}
										/>
									</ReactCreditCardsContainer>
								</>
							)}
						</div>
						<div className='col-12'>
							<div
								className={classNames('rounded-3', {
									'bg-l10-dark': cardList.length > 0 && !darkModeStatus,
									'bg-dark': cardList.length > 0 && darkModeStatus,
								})}>
								<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
									{cardList.length > 0 ? (
										cardList.map((c) => (
											<div key={c.id} className='col'>
												<Button
													color='dark'
													isLight={
														darkModeStatus
															? c.id === selectedCardId
															: c.id !== selectedCardId
													}
													className='w-100 text-capitalize'
													rounded={1}
													onClick={() => setSelectedCardId(c.id)}>
													{`${Payment.fns.cardType(
														c.number,
													)} - ${c.number.slice(
														Payment.fns.cardType(c.number) === 'amex'
															? -5
															: -4,
													)}`}
												</Button>
											</div>
										))
									) : (
										<div className='col-12 d-flex flex-column'>
											<div className=''>
												<div className='d-flex align-items-end gap-2'>
													<h1>Nenhum cartão adicionado</h1>
													<Button
														color='light'
														icon='AddCircle'
														size='lg'
														isLink={true}
														onClick={() =>
															setModalStatus(true)
														}></Button>
												</div>
												<div className='d-flex align-items-end'>
													<p>
														Adicione um cartão para começar a usar a
														carteira
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			<Modal
				setIsOpen={setModalStatus}
				isOpen={modalStatus}
				size='xl'
				titleId='add-new-card'
				isCentered>
				<ModalHeader setIsOpen={setModalStatus}>
					<ModalTitle id='add-new-card'>Lista de Cartões</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row'>
						<div className='col-md-6'>
							<ReactCreditCards
								cvc={formik.values.cvc}
								expiry={formik.values.expiry}
								name={formik.values.name}
								number={formik.values.number
									.toString()
									.replace(/\d(?!(\d*)$)/g, '*')}
								preview
								issuer={Payment.fns.cardType(formik.values.number)}
								focused={focused}
							/>

							<form className='row g-4' noValidate onSubmit={formik.handleSubmit}>
								<FormGroup className='col-12' id='name' label='Nome'>
									<Input
										placeholder='Nome do Cartão'
										autoComplete='ccName'
										onChange={formik.handleChange}
										value={formik.values.name}
										onFocus={handleInputFocus}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.name}
										invalidFeedback={formik.errors.name}
										validFeedback='Ótimo!'
									/>
								</FormGroup>

								<FormGroup className='col-6' id='number' label='Número do Cartão'>
									<Input
										type='text'
										mask={
											Payment.fns.cardType(formik.values.number) === 'amex'
												? '9999 999999 99999'
												: '9999 9999 9999 9999'
										}
										autoComplete='cc-number'
										placeholder='Digite o número do cartão'
										required
										onChange={formik.handleChange}
										value={formik.values.number}
										onFocus={handleInputFocus}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.number}
										invalidFeedback={formik.errors.number}
										validFeedback='Ótimo!'
									/>
								</FormGroup>

								<FormGroup className='col-3' id='cvc' label='CVC'>
									<Input
										type='number'
										autoComplete='cc-csc'
										placeholder='CVC'
										required
										onChange={formik.handleChange}
										value={formik.values.cvc}
										onFocus={handleInputFocus}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.cvc}
										invalidFeedback={formik.errors.cvc}
										validFeedback='Ótimo!'
									/>
								</FormGroup>

								<FormGroup className='col-3' id='expiry' label='Validade'>
									<Input
										type='text'
										autoComplete='cc-exp'
										placeholder='MM/AA'
										mask='99/99'
										required
										onChange={formik.handleChange}
										value={formik.values.expiry}
										onFocus={handleInputFocus}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.expiry}
										invalidFeedback={formik.errors.expiry}
										validFeedback='Ótimo!'
									/>
								</FormGroup>

								<div className='col'>
									{!waiting ? (
										<Button
											isDisable={!formik.isValid && !!formik.submitCount}
											type='submit'
											color='info'
											icon='Save'>
											{actionCard === 'add'
												? 'Adicionar'
												: actionCard === 'edit'
													? 'Editar'
													: actionCard === 'delete'
														? 'Excluir'
														: ''}
										</Button>
									) : (
										<div className='d-flex px-3 py-2'>
											<Spinner color='info' size='20px' />
										</div>
									)}
								</div>
							</form>
						</div>

						<div className='col-md-6'>
							{cardList.length > 0 ? (
								<table className='table table-modern table-hover'>
									<colgroup>
										<col style={{ width: 25 }} />
										<col style={{ width: 75 }} />
										<col />
										<col />
									</colgroup>
									<thead>
										<tr>
											<th>#</th>
											<th>Tipo</th>
											<th>Nome</th>
											<th>Validade</th>
										</tr>
									</thead>
									<tbody>
										{cardList.map((c, index) => (
											<tr key={c.id}>
												<td>{index + 1}</td>
												<td aria-label='Payment'>
													<div
														className={`payment-type-${Payment.fns.cardType(
															c.number,
														)}`}
													/>
												</td>
												<td className='text-capitalize'>
													<div className='fw-bold fs-6 mb-0'>
														{Payment.fns.cardType(c.number)}
													</div>
													<div className='text-muted mt-n1'>
														<small>
															{c.number.slice(
																Payment.fns.cardType(c.number) ===
																	'amex'
																	? -5
																	: -4,
															)}
														</small>
													</div>
												</td>
												<td>{c.expiry}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className='col-12 d-flex flex-column'>
									<div className='d-flex flex-column align-items-center'>
										<img
											src={HumanShield}
											alt='Human Shield'
											style={{ width: '300px', marginRight: '-100px' }}
										/>
										{/* <h1>Nenhum cartão adicionado</h1> */}
									</div>
								</div>
							)}
						</div>
					</div>
				</ModalBody>
			</Modal>

			<Modal setIsOpen={setModalDelete} isOpen={modalDelete} size='xl' titleId='delete-card'>
				<ModalHeader setIsOpen={setModalDelete}>
					<ModalTitle id='delete-card'>
						Excluir Cartão <span className='text-danger text-capitalize'>{selectedCard?.name}</span>
					</ModalTitle>
				</ModalHeader>

				<ModalBody>
					<p>
						Tem certeza que deseja excluir o cartão{' '}
						<span className='text-danger text-capitalize'>{selectedCard?.name}</span> ?
					</p>
				</ModalBody>
				
				<ModalFooter>
					<Button color='info'
						isLink
						onClick={() => setModalDelete(false)}
					>
						Fechar
					</Button>
					<Button 
						color='danger' 
						icon='Delete'
						isLight
						onClick={() => deleteCard(selectedCard)}
					>
						Excluir
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default CompanyWallet;
