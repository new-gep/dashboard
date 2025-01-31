import { useEffect, useState } from 'react';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import Card from '../../../components/bootstrap/Card';
import { CardBody } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import SelectPlan from './step/1-selectPlan';
import PaymentPlan from './step/2-paymentPlan';

export default function LockSystem(){
    const [modalStatus, setModalStatus] = useState(true);
    const [plan, setPlan] = useState<any>(null);
    const [step, setStep] = useState(1);

    useEffect(() => {
        
    }, []);

    return(
        <Modal
            setIsOpen={setModalStatus}
            isOpen={modalStatus}
            size='xl'
            titleId='add-new-card'
            isCentered
            fullScreen
            isStaticBackdrop
        >
            <ModalHeader>
                <ModalTitle id='add-new-card'>Planos</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {step > 1 && 
                    <div>   
                        <Button className='flex d-flex align-items-center justify-content-center gap-2' 
                            onClick={() => setStep(step - 1)}
                        >
                            <Icon icon='ArrowBack' />
                            Voltar
                        </Button>
                    </div>
                }
                {step === 1 && <SelectPlan setStep={setStep} setPlan={setPlan} plan={plan}/>}
                {step === 2 && <PaymentPlan/>}

            </ModalBody>
        </Modal>
    )
}