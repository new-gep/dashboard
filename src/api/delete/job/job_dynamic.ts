import axios from "axios";


export default async function Job_Dynamic(name:any, id:any, where?:any){
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API}job/document/dynamic/${name}/${id}/${where}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};