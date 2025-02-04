import React, { useState } from 'react';
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
export default function PaymentPlan({ plan }: { plan: any }) {
	const [paymentMethod, setPaymentMethod] = useState('creditCard');
	const [cardDetails, setCardDetails] = useState({
		number: '',
		name: '',
		expiry: '',
		cvc: '',
	});
	const [focused, setFocused] = useState<Focused>('number');
	const [savedCards, setSavedCards] = useState([
		// Exemplo de cartões salvos
		{ id: 1, number: '4111 1111 1111 1111', name: 'John Doe', expiry: '12/23', cvc: '123' },
		{ id: 2, number: '5500 0000 0000 0004', name: 'Jane Doe', expiry: '11/24', cvc: '456' },
	]);
	const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
	const [saveCardChecked, setSaveCardChecked] = useState<boolean>(false);
	const [generateQRCode, setGenerateQRCode] = useState<boolean>(false);
	const [generateTicket, setGenerateTicket] = useState<boolean>(false);

	// Dados de exemplo do pedido
	const orderSummary = {
		productImage: 'https://via.placeholder.com/100', // Substitua pela URL da imagem do produto
		productName: 'BMW 3 Series',
		price: '$12000.18 Lakh',
		deliveryTime: '11 Jan 2022, 10:00 am',
		commission: '-$140.00',
		invoice: '000-1234-BMW-001',
		discount: '10%',
		subtotal: '$11800.18',
		total: '$11800.18',
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCardDetails({ ...cardDetails, [name]: value });
	};

	const handleInputFocus = ({ target }: { target: { name: Focused } }) => setFocused(target.name);

	const handleCardSelect = (id: number) => {
		const selectedCard = savedCards.find((card) => card.id === id);
		if (selectedCard) {
			setCardDetails({
				number: selectedCard.number,
				name: selectedCard.name,
				expiry: selectedCard.expiry,
				cvc: selectedCard.cvc,
			});
			setSelectedCardId(id);
			setSaveCardChecked(false);
		}
	};

	const handleNewCard = () => {
		setCardDetails({ number: '', name: '', expiry: '', cvc: '' });
		setSelectedCardId(null);
		setSaveCardChecked(false);
	};

	const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSaveCardChecked(e.target.checked);
	};

	const saveCard = () => {
		if (saveCardChecked) {
			const newCard = {
				id: savedCards.length + 1,
				...cardDetails,
			};
			setSavedCards([...savedCards, newCard]);
		}
		setCardDetails({ number: '', name: '', expiry: '', cvc: '' });
	};

	const handleGenerateTicket = () => {
		console.log('Gerar Boleto');
		setGenerateTicket(true);
	};

	const handleGenerateQRCode = () => {
		console.log('Gerar QR Code');
		setGenerateQRCode(true);
	};

	return (
		<div className='container-fluid gap-2' style={{ height: '100vh' }}>
			<h1>Escolha o Método de Pagamento</h1>
			<div className='d-flex gap-3 my-4'>
				<Button
					isLink
					color={paymentMethod === 'creditCard' ? 'success' : 'light'}
					onClick={() => setPaymentMethod('creditCard')}>
					Cartão de Crédito
				</Button>
				<Button
					isLink
					color={paymentMethod === 'ticket' ? 'success' : 'light'}
					onClick={() => setPaymentMethod('ticket')}>
					Boleto
				</Button>

				<Button
					isLink
					color={paymentMethod === 'pix' ? 'success' : 'light'}
					onClick={() => setPaymentMethod('pix')}>
					Pix
				</Button>
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

							{savedCards.map((card) => (
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
										cvc={card.cvc}
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
						<div className='col-md-4 col-12 px-1'>
							<form>
								<div className='mb-3'>
									<label htmlFor='number' className='form-label'>
										Número do Cartão
									</label>
									<input
										type='text'
										className='form-control'
										id='number'
										name='number'
										value={cardDetails.number}
										onChange={handleInputChange}
										onFocus={handleInputFocus}
									/>
								</div>
								<div className='mb-3'>
									<label htmlFor='name' className='form-label'>
										Nome no Cartão
									</label>
									<input
										type='text'
										className='form-control'
										id='name'
										name='name'
										value={cardDetails.name}
										onChange={handleInputChange}
										onFocus={handleInputFocus}
									/>
								</div>
								<div className='row'>
									<div className='col-md-6 mb-3'>
										<label htmlFor='expiry' className='form-label'>
											Validade
										</label>
										<input
											type='text'
											className='form-control'
											id='expiry'
											name='expiry'
											value={cardDetails.expiry}
											onChange={handleInputChange}
											onFocus={handleInputFocus}
										/>
									</div>
									<div className='col-md-6 mb-3'>
										<label htmlFor='cvc' className='form-label'>
											CVC
										</label>
										<input
											type='text'
											className='form-control'
											id='cvc'
											name='cvc'
											value={cardDetails.cvc}
											onChange={handleInputChange}
											onFocus={handleInputFocus}
										/>
									</div>
								</div>
								<div className='d-flex justify-content-between mt-3 px-3 '>
									{selectedCardId === null && (
										<div className='form-check mb-3'>
											<input
												type='checkbox'
												className='form-check-input'
												id='saveCard'
												checked={saveCardChecked}
												onChange={handleSaveCardChange}
											/>
											<label className='form-check-label' htmlFor='saveCard'>
												Salvar Cartão
											</label>
										</div>
									)}
									<Button color='success'>Pagar</Button>
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
											<span className='text-danger'>R$ - {plan.discount},00</span>
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
											<span className='text-success'>R$ {plan.price - plan.discount},00</span>
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
											<span className='text-danger'>R$ - {plan.discount},00</span>
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
											<span className='text-success'>R$ {plan.price - plan.discount},00</span>
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
											<img
												src={Pix}
												alt='Pix'
												className='img-fluid'
												style={{ width: '150px', height: '150px' }}
											/>
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
											<span className='text-danger'>R$ - {plan.discount},00</span>
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
											<span className='text-success'>R$ {plan.price - plan.discount},00</span>
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
