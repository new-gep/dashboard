import axios from "axios";

export default async function MasterAdmin(cnpj: string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}user/MasterAdmin/${cnpj}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
    
};