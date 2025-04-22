import axios from 'axios';

export default async function JobFile(id: number, name: string, signature: any, dynamic?: any) {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_API}job/file/${id}/${name}/${signature}/${dynamic}`,
		);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
