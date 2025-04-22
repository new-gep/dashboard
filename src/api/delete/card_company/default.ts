import axios from 'axios';

export default async function DeleteCardCompany(id: any) {
	try {
		const response = await axios.delete(`${process.env.REACT_APP_API}card-company/${id}`);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
