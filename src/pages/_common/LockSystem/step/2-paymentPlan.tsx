import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../../components/bootstrap/Button';
import Card from '../../../../components/bootstrap/Card';
import { CardBody, CardHeader, CardTitle } from '../../../../components/bootstrap/Card';
import ReactCreditCardsContainer from '../../../../components/extras/ReactCreditCardsContainer';
// @ts-ignore
import ReactCreditCards, { Focused } from 'react-credit-cards-2';
import Payment from 'payment';
import 'react-credit-cards-2/es/styles-compiled.css';
import Icon from '../../../../components/icon/Icon';
import SubHeader, { SubheaderSeparator } from '../../../../layout/SubHeader/SubHeader';
import Pix from './pix.png';
import AllCardCompany from '../../../../api/get/card_company/AllCardCompany';
import AuthContext from '../../../../contexts/authContext';
import { useFormik } from 'formik';
import Card_Company from '../../../../api/post/card_company/create';
import Toasts from '../../../../components/bootstrap/Toasts';
import { toast } from 'react-toastify';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../../components/bootstrap/forms/Checks';
import DefaultPayment from '../../../../api/post/payment/Default';
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

export default function PaymentPlan({ plan }: { plan: any }) {
	const [paymentMethod, setPaymentMethod] = useState('creditCard');
	const [cardDetails, setCardDetails] = useState({
		number: '',
		name: '',
		expiry: '',
		cvc: '',
	});
	const [focused, setFocused] = useState<Focused>('number');
	const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
	const [saveCardChecked, setSaveCardChecked] = useState<boolean>(false);
	const [generateQRCode, setGenerateQRCode] = useState<boolean>(false);
	const [generateTicket, setGenerateTicket] = useState<boolean>(false);
	const [qrCodeLink, setQrCodeLink] = useState<string>('');
	const [discount, setDiscount] = useState<number>(plan.discount);
	const [total, setTotal] = useState<number>(plan.price - discount);
	const [coupon, setCoupon] = useState<string>('');
	const { userData } = useContext(AuthContext);
	const [cardList, setCardList] = useState<
		{ id: number; name: string; number: string; expiry: string; cvc: number | string }[]
	>([]);

	const formik = useFormik({
		initialValues: {
			name: '',
			number: '',
			expiry: '',
			cvc: '',
			saveCard: false,
		},
		validate,
		onSubmit: (values) => {
			handleGeneratePaymentAndSaveCard(values);
		},
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCardDetails({ ...cardDetails, [name]: value });
	};

	const convertToYearMonth = (expiry: string) => {
		const [month, year] = expiry.split("/"); // Pega o mês e o "ano"
		return `20${year}-${month.padStart(2, "0")}`; // Formata para YYYY-MM
	};

	const handleInputFocus = ({ target }: { target: { name: Focused } }) => setFocused(target.name);

	const handleCardSelect = (id: number) => {
		const selectedCard = cardList.find((card) => card.id === id);
		if (selectedCard) {
			formik.setValues({
				name: selectedCard.name,
				number: selectedCard.number,
				expiry: selectedCard.expiry,
				cvc: '',
				saveCard: false,
			});
			setSelectedCardId(id);
			setSaveCardChecked(false);
		}
	};

	const handleNewCard = () => {
		formik.setValues({
			name: '',
			number: '',
			expiry: '',
			cvc: '',
			saveCard: false,
		});
		setSelectedCardId(null);
		setSaveCardChecked(false);
	};

	const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSaveCardChecked(e.target.checked);
	};

	const handleGeneratePaymentAndSaveCard = async (values: {
		name: string;
		number: string;
		cvc: number | string;
		expiry: string;
	}) => {
		// setWaiting(true);
		if (saveCardChecked) {
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
				// setModalStatus(false);
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
		}

		const formattedExpiry = convertToYearMonth(values.expiry);

		const response = await DefaultPayment({
			CNPJ_Company: userData.cnpj,
			method: paymentMethod,
			amount: total,
			status: 'pending',
			name: values.name,
			email: userData.email,
			phone: userData.phone,
			additionalInfo: 'Pagamento de assinatura',
			numberCard: values.number,
			nameCard: values.name,
			expiresAtCard: formattedExpiry,
			cvvCard: values.cvc,
		});
		console.log(response);
		switch (response.status) {
			case 200:
				console.log(response.payment);
				switch(response.payment){
					case 'denied':
						toast(
							<Toasts
								icon={'Close'}
								iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
								title={'Erro'}>
								Erro ao realizar pagamento, tente novamente.
							</Toasts>,
						);
						return;
				break;
					case 'captured':
						toast(
							<Toasts
								icon={'Check'}
								iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
								title={'🥳 Parabéns! '}>
								Pagamento realizado com sucesso.
							</Toasts>,
						);
						return;
				default:
				toast(
					<Toasts
						icon={'Close'}
						iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'Erro'}>
						Erro ao realizar pagamento, tente novamente.
					</Toasts>,
				);
			break;
			}
		}
		// setWaiting(false);
		// setWaiting(false);
	};

	const handleGenerateTicket = () => {
		console.log('Gerar Boleto');
		setGenerateTicket(true);
	};

	const handleGenerateQRCode = async () => {
		const response = await DefaultPayment({
			CNPJ_Company: userData.cnpj,
			method: paymentMethod,
			amount: total,
			status: 'pending',
			name: userData.name,
			email: userData.email,
			phone: userData.phone,
			additionalInfo: 'Pagamento de assinatura',
		});
		console.log(response);
		setQrCodeLink(response.payment.image);
		switch (response.status) {
			case 200:
				toast(
					<Toasts
						icon={'Check'}
						iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'🥳 Parabéns! '}>
						QRCode gerado com sucesso.
					</Toasts>,
				);
				break;
			default:
				toast(
					<Toasts
						icon={'Close'}
						iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'Erro'}>
						Erro ao realizar pagamento, tente novamente.
					</Toasts>,
				);
				break;
		}

		setGenerateQRCode(true);
		startCountdown();
	};

	const startCountdown = () => {
		const countdownTime = 15 * 60 * 1000; // 15 minutos em milissegundos
		const endTime = Date.now() + countdownTime;

		const interval = setInterval(() => {
			const remainingTime = endTime - Date.now();
			if (remainingTime <= 0) {
				clearInterval(interval);
				setGenerateQRCode(false);
				toast(
					<Toasts
						icon={'Close'}
						iconColor={'danger'}
						title={'Tempo Esgotado'}>
						O tempo para pagamento expirou. Por favor, gere um novo QR Code.
					</Toasts>,
				);
			} else {
				const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
				const seconds = Math.floor((remainingTime / 1000) % 60);
				setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
			}
		}, 1000);
	};

	const [countdown, setCountdown] = useState<string>('15:00');

	const handleApplyDiscount = () => {
		if (coupon == '') {
			toast(
				<Toasts
					icon={'Close'}
					iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Erro'}>
					Digite um cupom de desconto.
				</Toasts>,
			);
			return;
		}
		if (coupon === 'JesusFiel') {
			const discount = Math.round(parseFloat(plan.price) * 0.1);
			plan.discount = discount;
			setDiscount(discount);
			setTotal(plan.price - discount);
			toast(
				<Toasts
					icon={'Check'}
					iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'🥳 Parabéns! '}>
					Cupom aplicado com sucesso.
				</Toasts>,
			);
		} else {
			toast(
				<Toasts
					icon={'Close'}
					iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Erro'}>
					Cupom incorreto.
				</Toasts>,
			);
		}
	};

	useEffect(() => {
		if (userData) {
			const fetchData = async () => {
				const response = await AllCardCompany(userData.cnpj);
				console.log(response);
				if (response.status === 200) {
					setCardList(response.data);
				}
			};
			fetchData();
		}
	}, [userData]);

	return (
		<div className='container-fluid gap-2' style={{ height: '100vh' }}>
			<h1>Escolha o Método de Pagamento</h1>
			<div className='d-flex  justify-content-between my-3'>
				<div className='d-flex  gap-3'>
					<div className='d-flex justify-content-center align-items-center'>
						<Button
							isLink
							color={paymentMethod === 'creditCard' ? 'success' : 'light'}
							onClick={() => setPaymentMethod('creditCard')}>
							Cartão de Crédito
						</Button>
					</div>
					<div className='d-flex justify-content-center align-items-center'>
						<Button
							isLink
							color={paymentMethod === 'ticket' ? 'success' : 'light'}
							onClick={() => setPaymentMethod('ticket')}>
							Boleto
						</Button>
					</div>
					<div className='d-flex justify-content-center align-items-center'>
						<Button
							isLink
							color={paymentMethod === 'pix' ? 'success' : 'light'}
							onClick={() => setPaymentMethod('pix')}>
							Pix
						</Button>
					</div>
				</div>

				<div className='d-flex gap-3 col-4'>
					<FormGroup className='row' id='cupom' label='Cupom de Desconto'>
						<Input
							onChange={(e: any) => setCoupon(e.target.value)}
							value={coupon}
							type='text'
							placeholder='Digite o cupom de desconto'
						/>
					</FormGroup>
					<div className='d-flex align-items-end justify-content-end'>
						<Button onClick={handleApplyDiscount} isLink color='success'>
							Aplicar
						</Button>
					</div>
				</div>
			</div>

			{paymentMethod === 'creditCard' && (
				<Card>
					{/* <CardHeader>
                        <CardTitle>Pagamento com Cartão de Crédito</CardTitle>
                    </CardHeader> */}
					<CardBody className='d-flex flex-column flex-md-row'>
						<div
							className='col-md-4 col-12 gap-2 d-flex flex-column align-items-center'
							style={{ overflowY: 'auto', maxHeight: '300px' }}>
							<div
								className='position-relative'
								onClick={handleNewCard}
								style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px' }}>
								{selectedCardId === null && (
									<Icon
										icon='AddCircle'
										color='light'
										size='3x'
										className='position-absolute top-0 end-0 m-0 r-1'
										style={{
											zIndex: 10,
											transition: 'transform 0.3s ease-in-out',
											transform:
												selectedCardId === null ? 'scale(1)' : 'scale(0)',
										}}
									/>
								)}
								<ReactCreditCards
									cvc=''
									expiry=''
									name=''
									number=''
									preview
									focused={focused}
								/>
							</div>

							{cardList.map((card) => (
								<div
									key={card.id}
									className='position-relative'
									onClick={() => handleCardSelect(card.id)}
									style={{
										cursor: 'pointer',
										padding: '10px',
										borderRadius: '5px',
									}}>
									<Icon
										icon='CheckCircle'
										color='success'
										size='3x'
										className='position-absolute top-0 end-0 m-0 r-3'
										style={{
											zIndex: 10,
											transition: 'transform 0.3s ease-in-out',
											transform:
												selectedCardId === card.id
													? 'scale(1)'
													: 'scale(0)',
										}}
									/>
									<ReactCreditCards
										cvc={''}
										expiry={card.expiry}
										name={card.name}
										number={card.number.replace(/\d(?!(\d*)$)/g, '*')}
										preview
										issuer={Payment.fns.cardType(card.number)}
										focused={focused}
									/>
								</div>
							))}
						</div>
						<div className='col-md-4 col-12 px-5'>
							<form
								className='d-flex flex-column gap-3'
								onSubmit={formik.handleSubmit}>
								<FormGroup className='row' id='number' label='Número'>
									<Input
										disabled={selectedCardId !== null}
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

								<FormGroup className='row' id='name' label='Nome'>
									<Input
										disabled={selectedCardId !== null}
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

								<div className='row'>
									<FormGroup className='col-6' id='cvc' label='CVC'>
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

									<FormGroup className='col-6' id='expiry' label='Validade'>
										<Input
											disabled={selectedCardId !== null}
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
								</div>

								<div
									className={`d-flex ${selectedCardId === null ? 'justify-content-between' : 'justify-content-end'} mt-3 px-3 `}>
									{selectedCardId === null && (
										<ChecksGroup className='d-flex justify-content-between mt-3 '>
											<Checks
												id='saveCard'
												label='Salvar Cartão'
												onChange={handleSaveCardChange}
												checked={saveCardChecked}
												isValid={formik.isValid}
												isTouched={formik.touched.saveCard}
												invalidFeedback={formik.errors.saveCard}
											/>
										</ChecksGroup>
									)}
									<Button type='submit' color='success'>
										Pagar
									</Button>
								</div>
							</form>
						</div>
						<div className='col-md-4 col-12 p-3 text-center px-5'>
							<h5>Resumo do Pedido</h5>
							<div>
								<div className='d-flex flex-column gap-3'>
									<div className='d-flex h-fit justify-content-center'>
										<div className='p-2 bg-light rounded-3'>
											<Icon icon={plan.icon} size='3x' color='primary' />
										</div>
									</div>
									<h6>{plan.name}</h6>
									<p>R$ {plan.price},00</p>
								</div>

								<ul className='list-unstyled'>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Desconto:</span>{' '}
											<span className='text-danger'>R$ - {discount},00</span>
										</div>
									</li>

									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Subtotal:</span>{' '}
											<span>R$ {plan.price},00</span>
										</div>
									</li>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Colaboradores:</span>{' '}
											<span>{plan.collaborators}+</span>
										</div>
									</li>

									<hr className='border-top border-light my-2' />
									<li>
										<div className='d-flex justify-content-between'>
											<strong>Total:</strong>{' '}
											<span className='text-success'>R$ {total},00</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</CardBody>
				</Card>
			)}

			{paymentMethod === 'ticket' && (
				<Card>
					<CardBody className='d-flex flex-column flex-md-row'>
						<div className='col-md-6 col-12 d-flex flex-column gap-3 p-3 px-5'>
							{!generateTicket ? (
								<>
									<div className='d-flex gap-5'>
										<Icon icon='Article' size='3x' color='primary' />
									</div>
									<ul>
										<li className='text-muted'>
											O prazo de validade do boleto é de 3 dia(s) úteis;
										</li>
										<li className='text-muted'>
											O boleto pode ser pago em qualquer agência bancária;
										</li>
										<li className='text-muted'>
											O banco nos enviará automaticamente a confirmação do
											pagamento em até 2 dias úteis;
										</li>
										<li className='text-muted'>
											Se o boleto não for pago até a data de vencimento (Nos
											casos de vencimento em final de semana ou feriado, no
											próximo dia útil), seu pedido será cancelado
											automaticamente;
										</li>
										<li className='text-muted'>
											Não faça depósito ou transferência entre contas.
										</li>
									</ul>
									<Button onClick={handleGenerateTicket} color='success'>
										Pagar
									</Button>
								</>
							) : (
								<div className='d-flex flex-column justify-content-between gap-3'>
									<div className='d-flex'>
										<Icon icon='Article' size='3x' color='primary' />
									</div>
									<div
										className='d-flex justify-content-center'
										style={{ height: '150px' }}>
										<div className='d-flex flex-column justify-content-center'>
											<p>
												Boleto gerado com{' '}
												<span className='fw-bold text-success'>
													sucesso
												</span>
												, acesse
											</p>
											<Button isLink color='success'>
												Aqui
											</Button>
										</div>
									</div>
									<Button
										isDisable
										onClick={handleGenerateQRCode}
										color='warning'>
										Aguardando Pagamento
									</Button>
								</div>
							)}
						</div>

						<div className='col-md-6 col-12 p-3 text-center px-5'>
							<h5>Resumo do Pedido</h5>
							<div>
								<div className='d-flex flex-column gap-3'>
									<div className='d-flex h-fit justify-content-center'>
										<div className='p-2 bg-light rounded-3'>
											<Icon icon={plan.icon} size='3x' color='primary' />
										</div>
									</div>
									<h6>{plan.name}</h6>
									<p>R$ {plan.price},00</p>
								</div>

								<ul className='list-unstyled'>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Desconto:</span>{' '}
											<span className='text-danger'>R$ - {discount},00</span>
										</div>
									</li>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Subtotal:</span>{' '}
											<span>R$ {plan.price},00</span>
										</div>
									</li>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Colaboradores:</span>{' '}
											<span>{plan.collaborators}+</span>
										</div>
									</li>

									<hr className='border-top border-light my-2' />
									<li>
										<div className='d-flex justify-content-between'>
											<strong>Total:</strong>{' '}
											<span className='text-success'>R$ {total},00</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</CardBody>
				</Card>
			)}

			{paymentMethod === 'pix' && (
				<Card>
					<CardBody className='d-flex flex-column flex-md-row'>
						<div className='col-md-6 col-12 d-flex flex-column justify-content-between gap-3 p-3 px-5'>
							{!generateQRCode ? (
								<>
									<>
										<div className='d-flex gap-5'>
											<Icon icon='Payments' size='3x' color='primary' />
										</div>
										<div className='text-center'>
											<p>
												Se a sua escolha é efetuar o pagamento via Pix,{' '}
												<span className='fw-bold text-success'>clique</span>{' '}
												em Gerar QR Code
											</p>
										</div>
									</>
									<Button onClick={handleGenerateQRCode} color='success'>
										Gerar QR Code
									</Button>
								</>
							) : (
								<>
									<div className='d-flex gap-5'>
										<Icon icon='Payments' size='3x' color='primary' />
									</div>
									<div className='text-center'>
										<div className='d-flex justify-content-center'>
											{qrCodeLink && (
												<img
													src={qrCodeLink}
													alt='Pix'
													className='img-fluid'
													style={{ width: '150px', height: '150px' }}
												/>
											)}
										</div>
										<div className='mt-3'>
											<span className='fw-bold text-danger'>
												Tempo restante: {countdown}
											</span>
										</div>
									</div>
									<Button
										isDisable
										onClick={handleGenerateQRCode}
										color='warning'>
										Aguardando Pagamento
									</Button>
								</>
							)}
						</div>

						<div className='col-md-6 col-12 p-3 text-center px-5'>
							<h5>Resumo do Pedido</h5>
							<div>
								<div className='d-flex flex-column gap-3'>
									<div className='d-flex h-fit justify-content-center'>
										<div className='p-2 bg-light rounded-3'>
											<Icon icon={plan.icon} size='3x' color='primary' />
										</div>
									</div>
									<h6>{plan.name}</h6>
									<p>R$ {plan.price},00</p>
								</div>

								<ul className='list-unstyled'>
									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Desconto:</span>{' '}
											<span className='text-danger'>R$ - {discount},00</span>
										</div>
									</li>

									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Subtotal:</span>{' '}
											<span>R$ {plan.price},00</span>
										</div>
									</li>

									<li>
										<div className='d-flex justify-content-between'>
											<span className='text-muted'>Colaboradores:</span>{' '}
											<span>{plan.collaborators}+</span>
										</div>
									</li>

									<hr className='border-top border-light my-2' />
									<li>
										<div className='d-flex justify-content-between'>
											<strong>Total:</strong>{' '}
											<span className='text-success'>R$ {total},00</span>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</CardBody>
				</Card>
			)}
		</div>
	);
}
