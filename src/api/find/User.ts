import axios from "axios";

interface PropsCreateCompany {
    user: string,
    password?:string
};

export default async function User(dates: PropsCreateCompany){
    try{
        const response = await axios.post(`${process.env.REACT_APP_API}user/SingIn`, dates)
        return response.data
    }catch(e){
        console.log(e) 
    }
    
};