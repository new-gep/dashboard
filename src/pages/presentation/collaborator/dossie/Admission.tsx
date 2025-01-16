import React, { useEffect } from 'react';
import { useState } from 'react';
import ModalDocument from '../modal/modalDocument';
import Button from '../../../../components/bootstrap/Button';
import { toast } from 'react-toastify';
import Toasts from '../../../../components/bootstrap/Toasts';
import Job_Check_Admissional from '../../../../api/get/job/Job_Check_Admissional';
import Spinner from '../../../../components/bootstrap/Spinner';
import JobFile from '../../../../api/get/job/Job_File';

export default function DossieAdmission(datesJob: any) {
	const [modal, setModal] = useState<boolean>(false);
    const [jobId, setJobId] = useState<any>(null);
	const [job, setJob] = useState<any>(null);
	const [typeDocument, setTypeDocument] = useState<any>(false);
	const [pathDocumentMain, setPathDocumentMain] = useState<any>('');
	const [pathDocumentSecondary, setPathDocumentSecondary] = useState<any>('');
    

	const searchDocument = async (type:string, document: string) => {
		let response;
        if(type == 'obligation'){
			response = await JobFile(jobId, document, '1');
        }else{
            response = await JobFile(jobId, 'dynamic', '1', document);
        }
		if(document == 'medical'){
			setTypeDocument(response.type)
			setPathDocumentMain(response.path)
			return
		}
		setTypeDocument(response.typeDocumentSignature);
		switch (response.typeDocumentSignature) {
			case 'pdf':
				setPathDocumentMain(response.pathDocumentSignature);
				break;
			default:
				if (Array.isArray(response.pathDocumentSignature)) {
					setPathDocumentMain(response.pathDocumentSignature[0]);
					setPathDocumentSecondary(response.pathDocumentSignature[1]);
				} else {
					setPathDocumentMain(response.pathDocumentSignature);
				}
				break;
		}

		setModal(true);
	};

	const documentName = (type: string, document: string) => {
		switch (type) {
			case 'obligation':
				switch (document.toLowerCase()) {
					case 'registration':
						return 'Ficha de Registro';
					case 'experience':
						return 'Contrato de Experiencia';
					case 'extension':
						return 'Acordo de Prorrogação de Horas';
					case 'compensation':
						return 'Acordo de Compensação de Horas';
					case 'voucher':
						return 'Solitação de Vale Transporte';
					case 'medical':
						return 'Exame Admissional'
				}
				break;
			case 'dynamic':
                return document.replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
                .trim(); 
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			if (datesJob && datesJob.job.id) {
                setJobId(datesJob.job.id)
				const response = await Job_Check_Admissional(datesJob.job.id);
				setJob(response);
			}
		};
		fetchData();
	}, [datesJob]);

	return (
		<section className='h-100 w-auto d-flex flex-column gap-4'>
			{typeDocument && (
				<ModalDocument
					typeDocument={typeDocument}
					pathDocumentMain={pathDocumentMain}
					pathDocumentSecondary={pathDocumentSecondary}
					openModal={modal}
					closeModal={setModal}
				/>
			)}

			{!job ? (
				<div className='w-auto h-100 d-flex justify-content-center align-items-center'>
					<div>
						<Spinner />
					</div>
				</div>
			) : (
				<>
					{job &&
						job.date.obligation &&
						Object.entries(job.date.obligation).map(([key, value]: [string, any]) => {
							// Certifique-se de que o valor seja verdadeiro antes de criar o botão
							if (value) {
								return (
									<div className='col-12' key={key}>
										<Button
											className='col-12 p-3'
											isLight={true}
											color='primary'
											onClick={() => searchDocument('obligation',key)}>
											<span className='fw-bold'>{documentName('obligation',key)}</span>
										</Button>
									</div>
								);
							}
							return null; // Ignora valores falsos
						})}

					{job &&
						job.date.obligation &&
						Object.entries(job.date.dynamic.document).map(
							([key, value]: [string, any]) => {
								// Certifique-se de que o valor seja verdadeiro antes de criar o botão
								if (value) {
									return (
										<>
											<p>Documentos Adicionais</p>

											<div className='col-12' key={key}>
												<Button
													className='col-12 p-3'
													isLight={true}
													color='primary'
													onClick={() => searchDocument('dynamic',value)}>
													<span className='fw-bold'>{documentName('dynamic',value)}</span>
												</Button>
											</div>
										</>
									);
								}
								return null; // Ignora valores falsos
							},
						)}
				</>
			)}
		</section>
	);
}
