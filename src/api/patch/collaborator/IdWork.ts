import axios from "axios";

const PatchCollaboratorIdWork = async (idWork: any, cpf:any) => {
    try{
        console.log('aqui')
        const response = await axios.patch(`${process.env.REACT_APP_API}collaborator/idWork/${cpf}`, {id_work:idWork})
        return response.data

    }catch(e){
        return{
            status:500,
            message:'No internet'
        }
    }
} 

export default PatchCollaboratorIdWork