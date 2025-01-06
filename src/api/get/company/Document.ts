import axios from "axios";

export default async function GetCompanyDocument(cnpj:string, document:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}company/document/${cnpj}/${document}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};