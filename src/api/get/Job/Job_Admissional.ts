import axios from "axios";

export default async function Job_Admissional(cnpj:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}job/process/admissional/${cnpj}`)
       
        return response.data
    }catch(e){
        console.log(e) 
    }
};