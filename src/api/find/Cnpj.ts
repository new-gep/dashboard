import axios from "axios";

export default async function cnpj(cnpj:string){
    let response:any;
    try{
        response = await axios.get(`https://open.cnpja.com/office/${cnpj}`)
        return response.data
    }catch(e){
        return { status : 400 };
    }
    
};