import Button from '../../../../components/bootstrap/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../../components/bootstrap/Modal';
import Picture from '../../../../api/patch/Picture';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import Select from '../../../../components/bootstrap/forms/Select';
import { Options } from '../../../../components/bootstrap/Option';
import Toasts from '../../../../components/bootstrap/Toasts';
import { toast } from 'react-toastify';
import Job from '../../../../api/patch/Job';
import AuthContext from '../../../../contexts/authContext';
import Mask from '../../../../function/Mask';
import CollaboratorHistoryJob from '../../../../api/get/collaborator/CollaboratorHistoryJob';

interface ModalDocumentProps {
	collaborator: any;
	job: any;
	openModal: boolean;
	closeModal: (value: boolean) => void;
    listen: number;
	setListen: (value: number) => void;
}

export default function ModalChangeWork({
	collaborator,
	job,
	openModal,
	closeModal,
    listen,
    setListen
}: ModalDocumentProps) {
    const { userData } = useContext(AuthContext);
	const [jobSelect, setJobSelect] = useState<null | any>(null);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await CollaboratorHistoryJob(collaborator.CPF);
            console.log('history: ',response)
        }
        fetchData()
    },[])

	

	return (
		<Modal isOpen={openModal} setIsOpen={closeModal} size={`lg`}>
			<ModalHeader>
                <div className='flex flex-column items-start justify-start text-start'>
                    <h1 className='text-start'>Funções</h1>
                    <p>Aqui é o historico de funções que <strong className='text-warning'>{collaborator && Mask('firstName',collaborator.name)}</strong> obteve na sua empresa.</p>
                </div>
			</ModalHeader>
			<ModalBody>
				<div>
					<Select
						placeholder={'Motivo da Demissão'}
						ariaLabel={'Motivo da demissão'}
						onChange={(event: ChangeEvent<HTMLSelectElement>) => {
							setJobSelect(event.target.value);
						}}>
						<Options
							list={[
								{ value: 'motivo1', text: 'Motivo 1' },
								{ value: 'motivo2', text: 'Motivo 2' },
								{ value: 'motivo3', text: 'Motivo 3' },
							]}
						/>
					</Select>
				</div>
			</ModalBody>
			<ModalFooter>
                <div>
					<Button onClick={()=>{closeModal(false)}} isLink={true} color='danger'>
						Fechar
					</Button>
				</div>
				<div>
					<Button onClick={()=>{}} isLight={true} color='primary'>
						Buscar
					</Button>
				</div>
			</ModalFooter>
		</Modal>
	);
}
