import axios from 'axios';

export default async function UserAllByCNPJ(CNPJ: string) {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}user/allBy/${CNPJ}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
