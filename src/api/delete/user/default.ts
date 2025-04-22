import axios from 'axios';

export default async function User(id: any) {
	try {
		console.log(`${process.env.REACT_APP_API}user/${encodeURIComponent(id)}`);
		const response = await axios.delete(
			`${process.env.REACT_APP_API}user/${encodeURIComponent(id)}`,
		);

		return response.data;
	} catch (e) {
		console.log(e);
	}
}
