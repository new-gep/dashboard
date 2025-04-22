import axios from 'axios';

const PatchCollaboratorDefault = async (dates: any, cpf: any) => {
	try {
		const response = await axios.patch(
			`${process.env.REACT_APP_API}collaborator/${cpf}`,
			dates,
		);
		return response.data;
	} catch (e) {
		return {
			status: 500,
			message: 'No internet',
		};
	}
};

export default PatchCollaboratorDefault;
