import axios from 'axios';

interface PropsCreateJob {
	benefits?: string;
	contract?: string;
	details?: string;
	image?: string;
	function: string;
	obligations: string;
	salary: string;
	time: JSON;
	user_update?: string;
}

export default async function Job(dates: PropsCreateJob) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}job`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
