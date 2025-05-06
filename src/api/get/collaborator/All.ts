import axios from 'axios';

export default async function CollaboratorAll() {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}collaborator`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
