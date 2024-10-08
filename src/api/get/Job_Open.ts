import axios from "axios";

export default async function Job_Open(cnpj:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}job/open/${cnpj}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};