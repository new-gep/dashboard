import axios from 'axios';

export default async function Job_One(id: string) {
	try {
		const response = await axios.get(`${process.env.REACT_APP_API}job/${id}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
