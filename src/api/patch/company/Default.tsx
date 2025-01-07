import axios from "axios";
const PatchCompanyDefault = async (dates: any, cnpj:string) => {
    delete dates.cnpj;
    delete dates.zip;
    try{
        const response = await axios.patch(`${process.env.REACT_APP_API}company/${cnpj}`, dates)
        return response.data
    }catch(e){
        return{
            status:500,
            message:'No internet'
        }
    }
} 

export default PatchCompanyDefault