import axios from 'axios';

export default async function Collaborator(cpf: string) {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}collaborator/${cpf}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
