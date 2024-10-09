import axios from "axios";
interface PropsUpdateJob {
    benefits?: string;
    contract?: string;
    details ?: string;
    image   ?: string;
    function : string;
    obligations: string;
    salary: string;
    time  : JSON;
    user_create?: string;
    CNPJ_company?:string;
    create_at?:string;
};

export default async function Job(dates: PropsUpdateJob, id:any){
    try{
        const response = await axios.patch(`${process.env.REACT_APP_API}job/${id}`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
};