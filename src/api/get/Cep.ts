import axios from 'axios';

export default async function FindCep(cep: string) {
	try {
		const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
		return response.data;
	} catch (e) {
		return { status: 400 };
	}
}
