import axios from 'axios';

interface PropsCreateJob {
	default: any;
	benefits: any;
	skills: any;
	localities: any;
	CNPJ_company:any;
	user_create: any;
}

export default async function Job(dates: PropsCreateJob) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}job`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
