import axios from "axios";

export default async function DismissalSignatures(cpf:any, id_work:any){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}picture/signature/dismissal/${cpf}/${id_work}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};