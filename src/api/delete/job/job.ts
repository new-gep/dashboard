import axios from 'axios';

export default async function Job(id: any) {
	try {
		const response = await axios.delete(`${process.env.REACT_APP_API}job/${id}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
