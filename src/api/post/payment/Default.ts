import axios from 'axios';

interface CreatePaymentDto {
	CNPJ_Company: string;
	method: string;
	amount: number;
	status?: string;
	name?: string;
	email?: string;
	phone?: string;
	additionalInfo?: string;
	numberCard?: string;
	nameCard?: string;
	expiresAtCard?: string;
	cvvCard?: any;
}

export default async function DefaultPayment(CreatePaymentDto: CreatePaymentDto) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}payment`, {
			CreatePaymentDto,
		});
		return response.data;
	} catch (e) {
		return { status: 400, error: e };
	}
}
