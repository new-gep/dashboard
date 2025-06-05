import axios from "axios";

export default async function StatusCandidate(dates: any, id: any) {
	try {
		const response = await axios.patch(`${process.env.REACT_APP_API}job/statusCandidate/${id}`, dates);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}