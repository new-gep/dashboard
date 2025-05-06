import axios from 'axios';

interface PropsCreateSignature {
    cpf_collaborator?: string;
    id_user?: string;
    id_job?: number;
    document: string;
}

export default async function CreateSignature(dates: PropsCreateSignature) {
	let response: any;
	try {
		response = await axios.post(`${process.env.REACT_APP_API}signature`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
