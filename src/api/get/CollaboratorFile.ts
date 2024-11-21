import axios from "axios";

export default async function CollaboratorFile(cpf:any, file:any){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}collaborator/file/${cpf}/${file}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};