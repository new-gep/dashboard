import axios from "axios";

export default async function Job_Check_Admissional(id:string){
    try{
        const response = await axios.get(`${process.env.REACT_APP_API}job/admissional/check/${id}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};