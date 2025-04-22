import axios from 'axios';

interface PropsUpdateUser {
	name?: string;
	email?: string;
	phone?: string;
	hierarchy?: string;
	password?: string;
	avatar?: any;
}

export default async function UpdateByAdmin(id: any, dates: PropsUpdateUser) {
	try {
		const response = await axios.patch(
			`${process.env.REACT_APP_API}user/admin/${encodeURIComponent(id)}`,
			dates,
		);
		return response.data;
	} catch (e) {
		console.log(e);
	}
}
