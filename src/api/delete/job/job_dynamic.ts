import axios from "axios";


export default async function Job_Dynamic(name:any, id:any){
    try{
        const response = await axios.delete(`${process.env.REACT_APP_API}job/document/dynamic/${name}/${id}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};