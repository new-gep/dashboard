import axios from "axios";
interface PropsUpdateUser {
	name ?: string;
	email?: string;
	phone?: string;
    hierarchy?: string;
	password?: string
	confirmPassword ?: string;
	avatar ?: any;
};

export default async function User(id: any, dates:PropsUpdateUser){
    // @ts-ignore
    dates.password = dates.currentPassword
    // @ts-ignore
    dates.name = `${dates.firstName} ${dates.lastName}`
    if(dates.phone){
        dates.phone = dates.phone.replace(/[()\s-]/g, '');
    }
    const filteredDates = filterProps(dates);
    try{
        const response = await axios.patch(`${process.env.REACT_APP_API}user/${encodeURIComponent(id)}`, filteredDates)
        return response.data
    }catch(e){
        console.log(e) 
    }
};

function filterProps(dates: any): PropsUpdateUser {
    const allowedKeys: (keyof PropsUpdateUser)[] = ["name", "email", "phone", "password", "confirmPassword", "avatar"];
    const filteredDates: PropsUpdateUser = {};

    for (const key of allowedKeys) {
        if (dates[key] !== undefined) {
            filteredDates[key] = dates[key];
        }
    }
    return filteredDates;
}
