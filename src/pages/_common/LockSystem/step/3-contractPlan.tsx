import { useEffect, useState } from 'react';
import ContractSignedDocument from '../../../../components/canva/signatures/Contract';
interface ContractPlanProps {
    plan: any;
}


export default function ContractPlan(props: ContractPlanProps){
    const [modal, setModal] = useState(false);
    const [document, setDocument] = useState(null);
    const [assignature, setAssignature] = useState(null);
    const [nameDocument, setNameDocument] = useState(null);
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [closeAfterSave, setCloseAfterSave] = useState(null);
    return(
        <div>
            <h1>ContractPlan</h1>
            <ContractSignedDocument
                modal={modal}
                setModal={setModal}
                document={document}
                assignature={assignature}
                nameDocument={nameDocument} 
            />
        </div>
    )
}
