import axios from 'axios';

export default async function AllCardCompany(cnpj: string) {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}card-company/${cnpj}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
