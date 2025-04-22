import axios from 'axios';

interface PropsUploadJob {
	file: File | string;
	name: string | null;
	id: number;
	signature: boolean;
	dynamic?: string;
}
export default async function JobPicture(propsUploadJob: PropsUploadJob) {
	if (!propsUploadJob.name) {
		return;
	}
	try {
		// Crie o objeto FormData
		const formData = new FormData();
		if (typeof propsUploadJob.file === 'string') {
			const base64String = propsUploadJob.file.replace(/^data:image\/\w+;base64,/, '');
			const byteCharacters = atob(base64String);
			const byteArrays = [];

			for (let offset = 0; offset < byteCharacters.length; offset += 512) {
				const slice = byteCharacters.slice(offset, offset + 512);

				const byteNumbers = new Array(slice.length);
				for (let i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				const byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}

			const blob = new Blob(byteArrays, { type: 'image/png' });

			formData.append('file', blob);
		} else {
			formData.append('file', propsUploadJob.file);
		}
		formData.append('idJob', propsUploadJob.id.toString());
		formData.append('name', propsUploadJob.name);
		formData.append('signature', propsUploadJob.signature ? '1' : '0');
		if (propsUploadJob.dynamic) {
			formData.append('dynamic', propsUploadJob.dynamic);
		}
		// Envia a solicitação com Axios
		const response = await axios.post(
			`${process.env.REACT_APP_API}job/upload`, // Endpoint da API
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data', // Define o cabeçalho correto
				},
			},
		);

		return response.data; // Retorna a resposta do servidor
	} catch (e) {
		console.error('Erro ao enviar o arquivo:', e);
		throw e; // Opcional: repassa o erro para ser tratado externamente
	}
}

const isBase64 = (str: any) => {
	const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	return base64Regex.test(str);
};
