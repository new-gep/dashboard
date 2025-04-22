import axios from 'axios';

export default async function FindAllByMonthAndYear(
	type: string,
	cnpj: string,
	month: string,
	year: string,
) {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_API}job/service/${type}/${cnpj}/${month}/${year}`,
		);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
