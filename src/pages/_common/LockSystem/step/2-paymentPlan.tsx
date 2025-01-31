import React, { useState } from 'react';
import Button from '../../../../components/bootstrap/Button';
import Card from '../../../../components/bootstrap/Card';
import { CardBody, CardHeader, CardTitle } from '../../../../components/bootstrap/Card';
import ReactCreditCardsContainer from '../../../../components/extras/ReactCreditCardsContainer';
// @ts-ignore
import ReactCreditCards, { Focused } from 'react-credit-cards-2';
import Payment from 'payment';
import 'react-credit-cards-2/es/styles-compiled.css';

export default function PaymentPlan() {
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails({ ...cardDetails, [name]: value });
    };

    return (
        <div className="container">
            <h1>Escolha o Método de Pagamento</h1>
            <div className="d-flex gap-3 my-4">
                <Button
                    isLink
                    color={paymentMethod === 'creditCard' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('creditCard')}
                >
                    Cartão de Crédito
                </Button>
                <Button
                    isLink
                    color={paymentMethod === 'boleto' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('boleto')}
                >
                    Boleto
                </Button>
                <Button
                    isLink
                    color={paymentMethod === 'pix' ? 'primary' : 'secondary'}
                    onClick={() => setPaymentMethod('pix')}
                >
                    Pix
                </Button>
            </div>

            {paymentMethod === 'creditCard' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pagamento com Cartão de Crédito</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ReactCreditCardsContainer
                        // @ts-ignore
                            cvc={cardDetails.cvc}
                            expiry={cardDetails.expiry}
                            name={cardDetails.name}
                            number={cardDetails.number}
                        />
                        <form className="mt-4">
                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Número do Cartão</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="number"
                                    name="number"
                                    value={cardDetails.number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome no Cartão</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={cardDetails.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="expiry" className="form-label">Validade</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="expiry"
                                        name="expiry"
                                        value={cardDetails.expiry}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cvc" className="form-label">CVC</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cvc"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <Button color="success" type="submit">Pagar</Button>
                        </form>
                    </CardBody>
                </Card>
            )}

            {paymentMethod === 'boleto' && (
                <div>
                    <h2>Pagamento com Boleto</h2>
                    <p>Detalhes do pagamento com boleto...</p>
                </div>
            )}

            {paymentMethod === 'pix' && (
                <div>
                    <h2>Pagamento com Pix</h2>
                    <p>Detalhes do pagamento com Pix...</p>
                </div>
            )}
        </div>
    );
}