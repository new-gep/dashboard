import axios from 'axios';

interface RecruitProps {
    thread?: any;
    message: string;
}
  

export default async function RecruitAutoComplet(RecruitProps:RecruitProps) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}assistant/recruit/autocomplet`, RecruitProps);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
