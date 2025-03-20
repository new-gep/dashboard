import axios from "axios";

export default async function GetCompanyContract(cnpj:string, plan:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}company/contract/${cnpj}/${plan}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};