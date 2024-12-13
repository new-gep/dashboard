import axios from "axios";

interface PropsCreateCompany {
    CNPJ: string,
    user: string,
    email : string,
    password: string,
    company_name: string,
    state_registration:string,
    municipal_registration:string,
    responsible:string,
    phone:string,
    zip_code:string,
    city:string,
    street:string,
    uf:string,
    district:string,
    number:string
};

export default async function Company(dates: PropsCreateCompany){
    let response:any;
    try{
        response = await axios.post(`${process.env.REACT_APP_API}company`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
};