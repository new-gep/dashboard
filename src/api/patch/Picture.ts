import axios from "axios";
export default async function Picture(dates: any, cpf:any){
    try{
        const response = await axios.patch(`${process.env.REACT_APP_API}picture/${cpf}`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
};