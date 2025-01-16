import axios from "axios";

export default async function CollaboratorHistoryJob(cpf:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}collaborator/history/job/${cpf}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};