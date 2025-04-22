import axios from 'axios';

interface PropsCreateCompany {
	hierarchy: string;
	CNPJ_company: string;
	name: string;
	avatar: string;
	user: string;
	email: string;
	phone: string;
	password: string;
}

export default async function CreateUser(dates: PropsCreateCompany) {
	let response: any;
	try {
		response = await axios.post(`${process.env.REACT_APP_API}user`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
