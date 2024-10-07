import axios from "axios";

interface PropsCreateJob {
    benefits?: string;
    contract?: string;
    details ?: string;
    image   ?: string;
    function:  string;
    journey :  string;
    obligations: string;
    salary: string;
    time  : string;
    create_at:string;
};

export default async function Job(dates: PropsCreateJob){
    try{
        const  response = await axios.post(`${process.env.REACT_APP_API}job`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
    
};