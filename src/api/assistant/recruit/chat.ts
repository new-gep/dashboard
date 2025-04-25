import axios from 'axios';

interface RecruitProps {
    thread?: any;
    message: string;
}
  

export default async function RecruitChat(RecruitProps:RecruitProps) {
	try {
		const response = await axios.post(`${process.env.REACT_APP_API}assistant/recruit/chat`, RecruitProps);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
