import axios from "axios";

export default async function Job_Demissional(cnpj:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}job/process/demissional/${cnpj}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};