import axios from 'axios';

export default async function Signatures(cpf: any, id_work: any) {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_API}picture/signature/admission/${cpf}/${id_work}`,
		);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
