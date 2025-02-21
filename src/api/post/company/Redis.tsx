import axios from "axios";

interface RedisProps {
    action: string
    key: string
    value?: any
    ttl?: number 
}
export default async function Redis(props: RedisProps) {
    try{
        const response = await axios.post(`${process.env.REACT_APP_API}company/redis`, props);
        return response.data;
    }catch(error){
        console.log(error);
    }
}
