import axios from 'axios';

const PatchCardCompanyDefault = async (dates: any, id: any) => {
	try {
		const response = await axios.patch(`${process.env.REACT_APP_API}card-company/${id}`, dates);
		return response.data;
	} catch (e) {
		return {
			status: 500,
			message: 'No internet',
		};
	}
};

export default PatchCardCompanyDefault;
