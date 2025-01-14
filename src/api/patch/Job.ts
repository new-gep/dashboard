import axios from "axios";
interface PropsUpdateJob {
    benefits?: string;
    contract?: string;
    details ?: string;
    image   ?: string;
    candidates?:any
    function ?: string;
    obligations?: string;
    salary?: string;
    
    time  ?: JSON;
    demission?: any | null;
    motion_demission?: string | null;
    user_edit?: string;
    user_create?: string;
    CPF_collaborator?:string;
    CNPJ_company?:string;
};

export default async function Job(dates: PropsUpdateJob, id:any){
    try{
        const response = await axios.patch(`${process.env.REACT_APP_API}job/${id}`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
};