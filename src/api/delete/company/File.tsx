import axios from "axios";

export default async function DeleteCompanyFile(path:any){
    try{
        const encodedPath = encodeURIComponent(path);
        const response = await axios.delete(`${process.env.REACT_APP_API}company/file/${encodedPath}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};