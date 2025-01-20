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

interface ModalDocumentProps {
	collaborator: any;
	job: any;
	setJob: (value: any) => void;
	allJob: any;
	openModal: boolean;
	closeModal: (value: boolean) => void;
	listen: number;
	setListen: (value: number) => void;
}

export default function ModalChangeWork({
	collaborator,
	job,
	setJob,
	allJob,
	openModal,
	closeModal,
	listen,
	setListen,
}: ModalDocumentProps) {
	const { userData } = useContext(AuthContext);
	const [jobSelect, setJobSelect] = useState<null | any>(null);
	const [jobList, setJobList] = useState<null | any>(null);

	useEffect(() => {
		if (allJob) {
			const list = allJob.map((jobItem: any) => ({
				value: jobItem.id, // O ID do job
				text: jobItem.function, // O nome da função
			}));
			setJobList(list);
		}
	}, [allJob]);

	const changeWork = () => {
		if (jobSelect) {
			const selectedJob = allJob.find((jobItem: any) => jobItem.id == jobSelect);
			if (selectedJob) {
				setJob(selectedJob);
				closeModal(false)
				toast(
					<Toasts
						icon={'Check'}
						iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'Sucesso'}>
						Função <b>{job.function}</b> aplicada com sucesso.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 5000, //
					},
				);
			}
		} else {
			toast(
				<Toasts
					icon={'WarningAmber'}
					iconColor={'warning'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Opa!'}>
					Selecione uma função diferente da atual.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 5000, //
				},
			);
			return;
		}
	};

	return (
		<Modal isOpen={openModal} setIsOpen={closeModal} size={`lg`}>
			<ModalHeader>
				<div className='flex flex-column items-start justify-start text-start'>
					<h1 className='text-start'>Funções</h1>
					<p>
						Aqui é o historico de funções que{' '}
						<strong className='text-warning'>
							{collaborator && Mask('firstName', collaborator.name)}
						</strong>{' '}
						obteve na sua empresa.
					</p>
				</div>
			</ModalHeader>
			<ModalBody>
				<div>
					<Select
						placeholder={job && job.function}
						ariaLabel={job && job.function}
						onChange={(event: ChangeEvent<HTMLSelectElement>) => {
							setJobSelect(event.target.value);
						}}>
						<Options list={jobList} />
					</Select>
				</div>
			</ModalBody>
			<ModalFooter>
				<div>
					<Button
						onClick={() => {
							closeModal(false);
						}}
						isLink={true}
						color='danger'>
						Fechar
					</Button>
				</div>
				<div>
					<Button onClick={changeWork} isLight={true} color='primary'>
						Buscar
					</Button>
				</div>
			</ModalFooter>
		</Modal>
	);
}
