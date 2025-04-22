import axios from 'axios';

export default async function Job_All_Collaborator(cpf: string) {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}job/all/${cpf}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
