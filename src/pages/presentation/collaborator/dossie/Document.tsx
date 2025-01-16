import { useState, useEffect } from 'react';
import Button from '../../../../components/bootstrap/Button';
import ModalDocument from '../modal/modalDocument';
import CollaboratorFile from '../../../../api/get/collaborator/CollaboratorFile';
import { toast } from 'react-toastify';
import Toasts from '../../../../components/bootstrap/Toasts';

export default function DossieDocument(collaborator: any) {
	const [modal, setModal] = useState<boolean>(false);
	const [typeDocument, setTypeDocument] = useState<any>(false);
	const [pathDocumentMain, setPathDocumentMain] = useState<any>('');
	const [pathDocumentSecondary, setPathDocumentSecondary] = useState<any>('');

	const searchDocument = async (document: string) => {
		let response: any;
		switch (document.toLowerCase()) {
			case 'rg':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'rg');
				break;
			case 'cnh':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'cnh');
				if (response.status == 500) {
					toast(
						<Toasts
							icon={'Filter'}
							iconColor={'info'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Documento Opcional'}>
							O candidato não enviou esse documento.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				break;
			case 'voter_registration':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'voter_registration');
				if (response.status == 500) {
					toast(
						<Toasts
							icon={'Filter'}
							iconColor={'info'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Documento Opcional'}>
							O candidato não enviou esse documento.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				break;
			case 'work_card':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'work_card');

				break;
			case 'school_history':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'school_history');
				break;
			case 'address':
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'address');

				break;
			case 'marriage_certificate':
				if (collaborator.collaborator.marriage != '1') {
					toast(
						<Toasts
							icon={'Block'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro!'}>
							O candidato é solteiro.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'marriage_certificate');
				break;
			case 'military_certificate':
				if (collaborator.collaborator.sex.toLowerCase() == 'f') {
					toast(
						<Toasts
							icon={'Block'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro!'}>
							Mulher não precisa de certificação militar.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'military_certificate');
				break;
			case 'children':
				if (Object.keys(collaborator.collaborator.children).length <= 0) {
					toast(
						<Toasts
							icon={'Block'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro!'}>
							O candidato não tem filhos.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 3000, // Examples: 1000, 3000, ...
						},
					);
					return;
				}
				response = await CollaboratorFile(collaborator.collaborator.CPF, 'children_certificate');
				break;
			default:
                console.log('desconhecido')
				break;
        }    
        setTypeDocument(response.type)  
        switch (response.type) {
			case 'children':
				setPathDocumentMain(response.path)
				break;
			case 'pdf':
				setPathDocumentMain(response.path)
				break;
			default:
				if(Array.isArray(response.path)){
					setPathDocumentMain(response.path[0])
					setPathDocumentSecondary(response.path[1])
				}else{
					setPathDocumentMain(response.path)
				}
				break;
		}
        setModal(true)
    };

    const closeDocument = async () => {
        setTypeDocument(null)
        setPathDocumentMain(null)
        setPathDocumentSecondary(null)
    }


	return (
		<section className='h-100 w-auto d-flex flex-column gap-4'>
			{typeDocument && 
                <ModalDocument
                    typeDocument={typeDocument}
                    pathDocumentMain={pathDocumentMain}
                    pathDocumentSecondary={pathDocumentSecondary}
                    openModal={modal}
                    closeModal={closeDocument}
                />
            }

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('rg')}
                >
					<span className='fw-bold'>RG</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('cnh')}
                >
					<span className='fw-bold'>CNH (opcional)</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('voter_registration')}
                >
					<span className='fw-bold'>Título de Eleitor (opcional)</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('work_card')}
                >
					<span className='fw-bold'>Carteira de Trabalho</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('school_history')}
                >
					<span className='fw-bold'>Histórico Escolar</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('address')}
                >
					<span className='fw-bold'>Comprovante de Endereço</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('children')}
                >
					<span className='fw-bold'>Filhos</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('marriage_certificate')}
                >
					<span className='fw-bold'>Certidão de Casamento</span>
				</Button>
			</div>

			<div className='col-12'>
				<Button className='col-12 p-3' isLight={true} color='primary'
                    onClick={()=>searchDocument('military_certificate')}
                >
					<span className='fw-bold'>Certificado Militar</span>
				</Button>
			</div>
		</section>
	);
}
