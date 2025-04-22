import { ChangeEvent, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../../../components/bootstrap/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../../components/bootstrap/Modal';
import Select from '../../../../components/bootstrap/forms/Select';
import { Options } from '../../../../components/bootstrap/Option';
import Toasts from '../../../../components/bootstrap/Toasts';
import Job from '../../../../api/patch/Job';
import AuthContext from '../../../../contexts/authContext';

interface ModalDocumentProps {
	collaborator: any;
	job: any;
	openModal: boolean;
	closeModal: (value: boolean) => void;
	listen: number;
	setListen: (value: number) => void;
}

export default function ModalDemission({
	collaborator,
	job,
	openModal,
	closeModal,
	listen,
	setListen,
}: ModalDocumentProps) {
	const { userData } = useContext(AuthContext);
	const [motion, setMotion] = useState<null | String>(null);

	const startDemission = async () => {
		if (!motion) {
			toast(
				<Toasts
					icon='Close'
					iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title='Erro!'>
					Erro ao iniciar a demissão, selecione um <b>motivo</b>
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000, //
				},
			);
			return;
		}
		const updateJob = {
			motion_demission: motion.toString(),
			demission: JSON.stringify({
				step: 1,
				status: null,
				user: userData.id,
				solicitation: 'company',
				observation: '',
			}),
			user_edit: userData.id,
		};
		const response = await Job(updateJob, job.id);
		if (response.status == 200) {
			setListen(listen + 1);
			toast(
				<Toasts
					icon='Check'
					iconColor='success' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title='Sucesso'>
					Processo de demissão iniciada com sucesso
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000, //
				},
			);
			return;
		}
		toast(
			<Toasts
				icon='Close'
				iconColor='danger' // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
				title='Erro!'>
				Erro interno, tente mais tarde!
			</Toasts>,
			{
				closeButton: true,
				autoClose: 1000, //
			},
		);
	};

	return (
		<Modal isOpen={openModal} setIsOpen={closeModal} size='lg'>
			<ModalHeader>
				<h1 className='text-center'>Demissão</h1>
			</ModalHeader>
			<ModalBody>
				<div>
					<Select
						placeholder='Motivo da Demissão'
						ariaLabel='Motivo da demissão'
						onChange={(event: ChangeEvent<HTMLSelectElement>) => {
							setMotion(event.target.value);
						}}>
						<Options
							list={[
								{ value: 'Redução de Custos', text: 'Redução de Custos' },
								{ value: 'Desempenho', text: 'Desempenho' },
								{ value: 'Outros', text: 'Outros' },
							]}
						/>
					</Select>
				</div>
			</ModalBody>
			<ModalFooter>
				<div>
					<Button onClick={startDemission} isLight color='danger'>
						Iniciar Demissão
					</Button>
				</div>
			</ModalFooter>
		</Modal>
	);
}
