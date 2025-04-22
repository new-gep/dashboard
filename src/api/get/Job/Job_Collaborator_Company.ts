import axios from 'axios';

export default async function JobCollaboratorCompany(cnpj: string) {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_API}job/collaborator/company/${cnpj}`,
		);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
