import axios from "axios";
interface PropsUploadService {
    file: File    | string,
    user: string | null,
    type  : string  | null,
    cnpj: string | null,
};

export default async function Service_Upload(propsUploadCompany:PropsUploadService) {
    try {
        if(!propsUploadCompany.user || !propsUploadCompany.type || !propsUploadCompany.cnpj){
            console.log('propsUploadCompany.user', propsUploadCompany.user);
            console.log('propsUploadCompany.type', propsUploadCompany.type);
            console.log('propsUploadCompany.cnpj', propsUploadCompany.cnpj);
            return
        }
        // Crie o objeto FormData
        const formData = new FormData();
        
        formData.append("file", propsUploadCompany.file);
        formData.append("user", propsUploadCompany.user); 
        formData.append("type", propsUploadCompany.type);
        formData.append("cnpj", propsUploadCompany.cnpj);

        // Envia a solicitação com Axios
        console.log('URL:', `${process.env.REACT_APP_API}company/service/upload`);
        const response = await axios.post(
            `${process.env.REACT_APP_API}company/service/upload`, // Endpoint da API
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Define o cabeçalho correto
                },
            }
        );

        return response.data; // Retorna a resposta do servidor
    } catch (e) {
        console.error("Erro ao enviar o arquivo:", e);
        throw e; // Opcional: repassa o erro para ser tratado externamente
    }
}

