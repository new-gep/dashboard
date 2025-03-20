import { useEffect, useState } from 'react';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Button from '../../../components/bootstrap/Button';
import Card from '../../../components/bootstrap/Card';
import { CardBody } from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import SelectPlan from './step/1-selectPlan';
import PaymentPlan from './step/2-paymentPlan';
//@ts-ignore
import ContractPlan from './step/3-contractPlan';
import Wizard, { WizardItem } from '../../../components/Wizard';
import Congratulation from './step/Congratulation';

export default function LockSystem(){
    const [modalStatus, setModalStatus] = useState(true);
    const [plan, setPlan] = useState<any>(null);
    const [step, setStep] = useState(3);

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
            <ModalHeader setIsOpen={step === 4 ? setModalStatus : undefined}>
                {step > 1 && step < 3 && 
                    <div>   
                        <Button className='flex d-flex align-items-center justify-content-center gap-2' 
                            onClick={() => setStep(step - 1)}

                        >
                            <Icon icon='ArrowBack' />
                            Voltar
                        </Button>
                    </div>
                }
         
            </ModalHeader>
            
            <ModalBody>
                {step === 1 && <SelectPlan setStep={setStep} setPlan={setPlan} plan={plan}/>}
                {step === 2 && <PaymentPlan plan={plan}/>}
                {step === 3 && <ContractPlan setStep={setStep} plan={plan}/>}
                {step === 4 && <Congratulation/>}

            </ModalBody>
        </Modal>
    )
}