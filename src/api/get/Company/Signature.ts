import axios from "axios";

export default async function Company(cnpj:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}company/signature/${cnpj}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};