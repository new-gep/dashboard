import axios from "axios";
interface PropsUpload {
    file: File    | string,
    document: string,
    cnpj: string,
};

export default async function PostCompanyDocument(PropsUpload:PropsUpload) {
    if(!PropsUpload.document){
        return
    }
    try {
        // Crie o objeto FormData
        const formData = new FormData();
        if(typeof PropsUpload.file === 'string'){
            const base64String = PropsUpload.file.replace(/^data:image\/\w+;base64,/, '');
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

            formData.append("file", blob)
        }else{
            formData.append("file", PropsUpload.file);
        }
        formData.append("cnpj", PropsUpload.cnpj); 
        formData.append("document", PropsUpload.document);

        // Envia a solicitação com Axios
        const response = await axios.post(
            `${process.env.REACT_APP_API}company/upload`, // Endpoint da API
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

const isBase64 = (str:any) => {
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
}
  
