import axios from 'axios';

interface PropsCreateJob {
	name: string;
	number: string;
	cvc: string;
	expiry: string;
	CNPJ: string;
	user_create: string;
}

export default async function Card_Company(dates: PropsCreateJob) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}card-company`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
