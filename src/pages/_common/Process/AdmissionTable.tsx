import React, { FC, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Spinner from '../../../components/bootstrap/Spinner';
import { FormikHelpers, useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { priceFormat } from '../../../helpers/helpers';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Mask from '../../../function/Mask';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import Job_Admissional from '../../../api/get/job/Job_Admissional';
import AuthContext from '../../../contexts/authContext';
import Job from '../../../api/patch/Job';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import CollaboratorFile from '../../../api/get/collaborator/CollaboratorFile';
import JobFile from '../../../api/get/job/Job_File';
import PicturePath from '../../../api/patch/Picture';
import Popovers from '../../../components/bootstrap/Popovers';
import Icon from '../../../components/icon/Icon';
import Checks from '../../../components/bootstrap/forms/Checks';
import Input from '../../../components/bootstrap/forms/Input';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Badge from '../../../components/bootstrap/Badge';
import JobPicture from '../../../api/post/Job_Picture';
import Job_Check_Admissional from '../../../api/get/job/Job_Check_Admissional';
import Job_Dynamic from '../../../api/delete/job/job_dynamic';
import SignedDocument from '../../../components/canva/SignedDocument';
import Signatures from '../../../api/get/picture/Signatures';
import GetCompanyDocument from '../../../api/get/company/Document';
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
const AdmissionTable: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const navigate = useNavigate();

    const [step, setStep] = useState(1)
    const [stepTitle, setStepTitle] = useState('Exame admisisional')
    const [stepIcon, setIcon] = useState('LooksOne')
    const { userData } = useContext(AuthContext);
	const [candidates, setCandidates] = useState<null | any>(null)
	const [candidatesStep, setCandidatesStep] = useState<null | any>(null)
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [menu, setMenu] = useState<boolean>(false)
	const [manipulating, setManipulating] = useState<null | any>(null)
	const [loaderTable, setLoaderTable] = useState<boolean>(false)
	const [manipulatingTable, setManipulatingTable] = useState<null | any>(null)
	const [titleManipulating, setTitleManipulating] = useState<null | any>(null)
	const [datesDynamicManipulating, setDatesDynamicManipulating] = useState<null | any>(null)
	const [controllerBodyManipulating, setControllerBodyManipulating] = useState<null | any>(null)
	const [SpinnerManipulating, setSpinnerManipulating] = useState<Boolean>(false)
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const [openDocument, setOpenDocument]  = useState<boolean>(false);
	const [typeDocument, setTypeDocument] = useState<any>(null);
	const [pathDocumentMain, setPathDocumentMain] = useState<any>(null);
	const [typeDocumentSignature, setTypeDocumentSignature] = useState<any>(null);
	const [pathDocumentSignature, setPathDocumentSignature] = useState<any>(null);
	const [typeDocumentSignatureFull, setTypeDocumentSignatureFull] = useState<any>(null);
	const [pathDocumentSignatureFull, setPathDocumentSignatureFull] = useState<any>(null);
	const [view, setView] = useState<any>(null);
	const [documentAvaliation, setDocumentAvaliation] = useState<string | null>(null);
	const [loadingStates, setLoadingStates] = useState<{ [cpf: string]: boolean }>({});
	const [loadingSearchDocument, setLoadingSearchDocument] = useState<boolean>(false);
	const [allAssignature, setAllAssignature]  = useState<any>(null);
	const [allDocument, setAllDocument ]  = useState<any>(null);
	const [modalSignedDocument, setModalSignedDocument ]  = useState<boolean>(false);
	const [isDynamic, setIsDynamic ]  = useState<boolean>(false);
	const [statusSignature, setStatusSignature ]  = useState<boolean | null>(false);
	const [statusAllSignature, setStatusAllSignature ]  = useState<any>(false);

	const formik = useFormik({
		onSubmit<Values>(
			values: Values,
			formikHelpers: FormikHelpers<Values>,
		): void | Promise<any> {
			return undefined;
		},
		initialValues: {
			document: '' as any | File, 
			documentNameAdd: '', 
			note  : '',
			notify: true,
		},
	});

	const handleUpcomingDetails = (note:any) => {
		setManipulating(null)
		formik.setFieldValue("note", note)
		setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
	};

	const handleUpcomingEdit = () => {
		if(upcomingEventsEditOffcanvas){
			setDocumentAvaliation(null)
			setManipulatingTable(null)
			setPathDocumentMain(null)
			setTypeDocument(null)
			setSpinnerManipulating(false)
			setIsDynamic(false)
		}
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};

	const closeAfterSaveDocumentSignature = () => {
		return new Promise(async (resolve, reject) => {
		  try {
			let allSignatureApproved:boolean = false
			const response = await Job_Check_Admissional(manipulatingTable.id);
			if (response.status === 200) {
			  setDatesDynamicManipulating(response.date);
			  const obligation = Object.keys(response.date.obligation);
			  let dynamic = Object.values(response.date.dynamic.signature)
			  //@ts-ignore
				.map(item => item.replace(/^\/+|\/+$/g, '').trim()) // Remove barras no começo e final
				.filter(item => item !== ""); // Filtra valores vazios
	  
			  const documentSignatures = Object.values(response.date.documentSignature);
	  
			  const obligationExists = obligation.every(required =>
				documentSignatures.some(signature =>
					//@ts-ignore
				  signature.toLowerCase().includes(required.toLowerCase())
				)
			  );
	  
			  const dynamicExists = dynamic.every(required =>
				documentSignatures.some(signature =>
					//@ts-ignore
				  signature.toLowerCase().includes(required.toLowerCase())
				)
			  );
			  const responseSignature = await Signatures(manipulatingTable.cpf);
			  //@ts-ignore
			  allSignatureApproved = responseSignature.pictures.every(picture => picture.status === 'approved');
			  if (obligationExists && dynamicExists && allSignatureApproved) {
				updateStatusCandidate(manipulatingTable, true, true);
			  }
			  setDocumentAvaliation(null);
			  setPathDocumentMain(null);
			  setTypeDocument(null);
			  setIsDynamic(false);
			  //@ts-ignore
			  resolve(); // Indica que a Promise foi resolvida com sucesso
			} else {
			  reject(new Error("Response status is not 200")); // Caso o status não seja 200, rejeita a Promise
			}
		  } catch (error) {
			reject(error); // Em caso de erro, rejeita a Promise
		  }
		});
	};
	
	const toggleMenu = (e:any, colaborator:any) => {
		console.log('colocaborador:', colaborator)
		setManipulating(colaborator)
		e.preventDefault(); 
		if(menu){
			setMenu(false)
			return
		}
		setMenuPosition({ x: e.clientX, y: e.clientY });
		setMenu(true)
	};

	const closeMenu = () => {
		setMenu(false)
		setManipulating(null)
	};

	const formSubmitController = async (action:string) => {
		switch (action) {
			case 'observation' :
				setSpinnerManipulating(true)
				//@ts-ignore
				const Newcandidates = candidates.map(({ cpf, step, status, verify, observation }) => ({ cpf, step, status, verify, observation }));
				const candidate = Newcandidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
				if(candidate){
					candidate.observation = formik.values.note;
				}else{
					setSpinnerManipulating(false)
					return
				}
				const params = {
					candidates:JSON.stringify(Newcandidates)
				}
				const update = await Job(params, manipulating.id)
				if(update.status == 200 ){
					const candidate = candidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
					candidate.observation = formik.values.note;
					//@ts-ignore
					const stepCandidates = candidates.filter(candidate => candidate.step === step);
					setCandidatesStep(stepCandidates)
					setSpinnerManipulating(false)
				}else{
					setSpinnerManipulating(false)
					console.log('não foi possível salvar a VAGA tabela (job)')
				}
				break	
			case 'kitAdmission':
				let document:string;
				if(documentAvaliation == 'add'){
					if(!formik.values.document || !formik.values.documentNameAdd){
						toast(
								<Toasts
									icon={ 'Close' }
									iconColor={ 'danger' }
									title={ 'Erro!'}
								>
									Antes de salvar, é necessário fazer o upload do arquivo e informar o nome que ele deverá ter.
								</Toasts>,
								{
									closeButton: true ,
									autoClose: 5000 //
								}
						)
						return
					};
					setSpinnerManipulating(true);
					const fileName = formik.values.documentNameAdd
					.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase()) 
					.replace(/^\w/, (c) => c.toUpperCase())  
					.replace(/\s+/g, ""); 

					const paramsJobPicture = {
						file:formik.values.document,
						name:'dynamic',
						id  :manipulatingTable.id,
						signature:false,
						dynamic:fileName
					};

					const response = await JobPicture(paramsJobPicture)
					if(response.status == 200){
						setSpinnerManipulating(false)
						formik.setFieldValue('document', '');
						formik.setFieldValue('documentNameAdd', '');
						toast(
							<Toasts
								icon={ 'Check' }
								iconColor={ 'success' }
								title={ 'Sucesso!'}
							>
								O arquivo foi salvo com sucesso.
							</Toasts>,
							{
								closeButton: true ,
								autoClose: 5000 //
							}
						)
						handleUpcomingEdit()
						return
					};
				}
				if(!formik.values.document){
					toast(
							<Toasts
								icon={ 'Close' }
								iconColor={ 'danger' }
								title={ 'Erro!'}
							>
								Antes de salvar, você deve fazer o upload do arquivo
							</Toasts>,
							{
								closeButton: true ,
								autoClose: 5000 //
							}
					)
					return
				};
				setSpinnerManipulating(true);
				switch (documentAvaliation) {
					case 'registration_form':
						document = 'registration'
						break;
					case 'experience_contract':
						document = 'experience'
						break;
					case 'hours_extension':
						document = 'extension'
						break;
					case 'hours_compensation':
						document = 'compensation'
						break;
					case 'transport_voucher':
						document = 'voucher'
						break;
				}
				const paramsJobPicture = {
					file:formik.values.document,
					//@ts-ignore
					name:document,
					id  :manipulatingTable.id,
					signature:false
				};
				const response = await JobPicture(paramsJobPicture) 
				if(response.status == 200){
					const response = await Job_Check_Admissional(manipulatingTable.id)
					if(response.status == 200){
						setDatesDynamicManipulating(response.date);
						const obligationValues = Object.values(response.date.obligation); // Obtém um array com os valores das propriedades
						const allTrue = obligationValues.every(value => value === true); 
					  
						if (allTrue) {
						  updateStatusCandidate(manipulatingTable, true, true);
						}
					}
					setSpinnerManipulating(false)
					formik.setFieldValue('document', '');
					toast(
						<Toasts
							icon={ 'Check' }
							iconColor={ 'success' }
							title={ 'Sucesso!'}
						>
							O arquivo foi salvo com sucesso.
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 5000 //
						}
					)
					handleUpcomingEdit()
					return
				}
			break
		};
		setSpinnerManipulating(false)
		handleUpcomingEdit()
	};

	const menuController = async (action:string) => {
		let candidate;
		let params;
		let update;
		let Newcandidates;
		switch (action) {
			case 'finishAdmission':
				finishAdmission()
				break;
			case 'nextStep':
				updateStatusCandidate(manipulating, null, null, true)
				break;
			case 'previousStep':
				updateStatusCandidate(manipulating, null, null, false)
				break;
			case 'profile':
				navigate(`/sales/Job/Customer/${manipulating.cpf}/${manipulating.id}`);
				break;
			case 'observation':
				setTitleManipulating('Adicione uma Observação');
				setControllerBodyManipulating('observation');
				formik.setFieldValue("note", manipulating.observation ? manipulating.observation : '')
				setUpcomingEventsEditOffcanvas(true);
				break;
			case 'email':
				const encodedSubject = encodeURIComponent('Assunto') ;
				const encodedBody    = encodeURIComponent('Digite seu texto') ;
				const mailtoURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${manipulating.email}&su=${encodedSubject}&body=${encodedBody}`;
				
				window.open(mailtoURL, '_blank');
				break;
			case 'whatsapp':
				const whatsappURL = `https://wa.me/${manipulating.phone}`;
				window.open(whatsappURL, '_blank');
				break;
		}
		setMenu(false)
	};

	const documentController = async (document:any, dynamic?:any, signature?:any) => {
		setPathDocumentMain(null)
		setTypeDocument(null)
		setPathDocumentSignature(null)
		setTypeDocumentSignature(null)
		setAllDocument(null)
		setAllAssignature(null)
		setLoadingSearchDocument(true)
		if(!dynamic){
			setIsDynamic(false)
		}

		let responseSignature;
		let responseDocument;

		switch (document) {
			case 'registration_form':
				setDocumentAvaliation(document)
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'registration', '1')
				}
				responseDocument = await JobFile(manipulatingTable.id, 'registration', '0');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						Ficha de Registro
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				);
				break;
			case 'experience_contract':
				setDocumentAvaliation(document)
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'experience', '1')
				}
				responseDocument = await JobFile(manipulatingTable.id, 'experience', '0');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						Contrato de Experiencia
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'hours_extension':
				setDocumentAvaliation(document)
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'extension', '1')
				}
				responseDocument = await JobFile(manipulatingTable.id, 'extension', '0');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						Acordo de Prorrogação de Horas
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'hours_compensation':
				setDocumentAvaliation(document)
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'compensation', '1')
				}
				responseDocument = await JobFile(manipulatingTable.id, 'compensation', '0');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						Acordo de Compensação de Horas
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'transport_voucher':
				setDocumentAvaliation(document)
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'voucher', '1')
				}
				responseDocument = await JobFile(manipulatingTable.id, 'voucher', '0');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						Solitação de Vale Transporte
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'dynamic':
				if(signature){
					responseSignature = await JobFile(manipulatingTable.id, 'dynamic', '1', dynamic);
				}
				responseDocument = await JobFile(manipulatingTable.id, 'dynamic', '0', dynamic);
				//@ts-ignore
				const formattedFileName = dynamic.replace(/([a-z])([A-Z])/g, '$1 $2');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						{formattedFileName}
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break
			case 'add':
				setDocumentAvaliation('add')
				break
			default:
				break;
		};

		if(step == 3){
			const response = await Signatures(manipulatingTable.cpf);
			if(response.status == 200){
				setStatusAllSignature(response.pictures)
				if(document != 'dynamic'){
					//@ts-ignore
					const filteredPictures = response.pictures.some(item => item.picture.toLowerCase().includes(document) && item.status == 'approved' );
					setStatusSignature(filteredPictures);
				}else{
					//@ts-ignore
					const filteredPictures = response.pictures.some(item => item.picture.includes(dynamic) && item.status == 'approved' );
					setStatusSignature(filteredPictures);
				}
			}
		};
	
		if(responseDocument  && responseDocument.status == 200){
			setAllDocument(responseDocument)
			setPathDocumentMain(responseDocument.path)
			setTypeDocument(responseDocument.type)
		};

		if(responseSignature  && responseSignature.status == 200){
			setAllAssignature(responseSignature)
			setPathDocumentSignature(responseSignature.path)
			setTypeDocumentSignature(responseSignature.type)
			setTypeDocumentSignatureFull(responseSignature.typeDocumentSignature ? responseSignature.typeDocumentSignature : null)
			setPathDocumentSignatureFull(responseSignature.pathDocumentSignature ? responseSignature.pathDocumentSignature : null)
		};

		setLoadingSearchDocument(false)
	};

	const actionController = async (candidate:any) => {
		let response;
		switch (candidate.step) {
			case 1:
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
				setManipulatingTable(candidate)
				// response = await CollaboratorFile(candidate.cpf, 'medical_examination');
				console.log(candidate)
				response = await JobFile(candidate.id,'medical','0' ,'0')
				console.log(response)
				if(response.status == 200){
					setDocumentAvaliation('medical_examination')
					setPathDocumentMain(response.path)
					setTypeDocument(response.type)
					setOpenDocument(true)
					setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
					setTimeout(() => {
						// console.log(typeDocument && pathDocumentMain && step != 3 )
					}, 2000)
					return
				}
				toast(
					<Toasts
						icon={ 'Close' }
						iconColor={ 'danger' }
						title={ 'Erro!'}
					>
						O candidato ainda não enviou o exame admissional.
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
				break;
			case 2:
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
				setDocumentAvaliation(null)
				response = await Job_Check_Admissional(candidate.id)
				if(response.status == 200){
					setDatesDynamicManipulating(response.date)
					const obligationValues = Object.values(response.date.obligation); // Obtém um array com os valores das propriedades
					const allTrue = obligationValues.every(value => value === true); 
					if (allTrue) {
						updateStatusCandidate(candidate, true, true);
					}
				}
				setManipulatingTable(candidate)
				setControllerBodyManipulating('kitAdmission');
				setTitleManipulating('Gerencie seu Kit Admissional');
				handleUpcomingEdit();
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
				break;
			case 3:
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
				setManipulatingTable(candidate)
				response = await Signatures(candidate.cpf);
				let allSignatureApproved:boolean = false
				if(response.status == 200){
					//@ts-ignore
					allSignatureApproved = response.pictures.every(picture => picture.status === 'approved');
					setStatusAllSignature(response.pictures)
				}else{
					setStatusAllSignature(null)
				}
				response = await Job_Check_Admissional(candidate.id)
				if(response.status == 200){
					setDatesDynamicManipulating(response.date)
					const obligation = Object.keys(response.date.obligation);
					let dynamic = Object.values(response.date.dynamic.signature);
					dynamic = dynamic
					//@ts-ignore
					.map(item => item.replace(/^\/+|\/+$/g, '').trim())  // Remove barras no começo e final
					.filter(item => item !== "");;
					const documentSignatures = Object.values(response.date.documentSignature)
					const obligationExists = obligation.every(required =>
						documentSignatures.some(signature =>
							//@ts-ignore
							signature.toLowerCase().includes(required.toLowerCase())
						)
					);
					const dynamicExists = dynamic.every(required =>
						documentSignatures.some(signature =>
						  //@ts-ignore
						  signature.toLowerCase().includes(required.toLowerCase())
						)
					);
					if (obligationExists && dynamicExists && allSignatureApproved) {
						updateStatusCandidate(candidate, true, true);
					};
				};
				setControllerBodyManipulating('signature');
				setTitleManipulating('Gerencie as Assinaturas');
				handleUpcomingEdit();
				setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
				break;
		}
	};

	const navegationStep = async (navigation:boolean) => {
        let newStep
        if(navigation){
            setStep(step + 1)
            newStep = step + 1
        }else{
            setStep(step - 1)
            newStep = step - 1
        }
		//@ts-ignore
		const stepCandidates = candidates.filter(candidate => candidate.step === newStep);
		setCandidatesStep(stepCandidates)
        switch (newStep) {
            case 1:
                setIcon('LooksOne')
                setStepTitle('Exame admisisional')
				
                break;
            case 2:
                setIcon('LooksTwo')
                setStepTitle('KIT admissional')
                break;
            case 3:
                setIcon('Looks3')
                setStepTitle('Assinaturas')
                break;
            // case 4:
            //     setIcon('Looks4')
            //     setStepTitle('')
            //     break;
            default:
                break;
        }
    };

	const AvaliationPicture = async (avaliation:boolean) => {
		try{
			const params = {
				status : avaliation ? 'approved': 'reproved',
				picture: view == 'signature' ? `admission_signature_${documentAvaliation}`: documentAvaliation,
				id_user: userData.id
			}
			const response:any = await PicturePath(params, manipulatingTable.cpf);
			if(response.status == 200){
				switch (manipulatingTable.step) {
					case 1:
						if(avaliation){
							updateStatusCandidate(manipulatingTable, true, true)
							toast(
								<Toasts
									icon={ 'Check' }
									iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={ 'Sucesso!'}
								>
									Exame admissional Aprovado com sucesso
								</Toasts>,
								{
									closeButton: true ,
									autoClose: 5000 //
								}
							)
						}else{
							updateStatusCandidate(manipulatingTable, null, false)
							toast(
								<Toasts
									icon={ 'Check' }
									iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={ 'Sucesso!'}
								>
									Exame admissional Rejeitado com sucesso
								</Toasts>,
								{
									closeButton: true ,
									autoClose: 5000 //
								}
							)
						}
						setOpenDocument(false)
						return;
					case 2:
						
						break;
					case 3:
						if(avaliation){
							setStatusSignature(true)
							toast(
								<Toasts
									icon={ 'Check' }
									iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={ 'Sucesso!'}
								>
									Assinatura aprovada com sucesso
								</Toasts>,
								{
									closeButton: true ,
									autoClose: 5000 //
								}
							)
						}else{
							setStatusSignature(false)
							updateStatusCandidate(manipulatingTable, null, false);
							toast(
								<Toasts
									icon={ 'Check' }
									iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={ 'Sucesso!'}
								>
									Assinatura reprovada com sucesso
								</Toasts>,
								{
									closeButton: true ,
									autoClose: 5000 //
								}
							)
						}
						const response = await Signatures(manipulatingTable.cpf);
						if(response.status == 200){
							setStatusAllSignature(response.pictures)
						}else{
							setStatusAllSignature(null)
						}

						setOpenDocument(false)
						break;
					default:
						console.log('step indefinido, ou manipulado não setado')
						break;
				}
			}else{
				toast(
					<Toasts
						icon={ 'Close' }
						iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Erro!'}
					>
						Algo deu errado. Tente mais tarde!
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
			}
		}catch(e){
			console.log('erro:', e)
			toast(
				<Toasts
					icon={ 'Close' }
					iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Erro!'}
				>
					Erro ao atualizar documento do candidato, tente mais tarde e verifique sua internet.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
		}
	};

	const deleteDocumentDynamic = async () => {
		const response = await Job_Dynamic(documentAvaliation, manipulatingTable.id);
		if(response.status == 200){
			handleUpcomingEdit();
			toast(
				<Toasts
					icon={ 'Check' }
					iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Sucesso!'}
				>
					Documento deletado com sucesso!
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			return
		}
		toast(
			<Toasts
				icon={ 'Close' }
				iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
				title={ 'Erro!'}
			>
				Erro ao deletar documento, tente mais tarde e verifique sua internet.
			</Toasts>,
			{
				closeButton: true ,
				autoClose: 5000 //
			}
		)
	};

	const updateStatusCandidate = async (dates:any, verify:any, status:any, isStep:any = undefined) => {

		//@ts-ignore
		const Newcandidates = candidates.map(({ cpf, step, status, verify, observation }) => ({ cpf, step, status, verify, observation }));
		let candidate       = Newcandidates.find((item: { cpf: string | undefined; }) => item.cpf === dates.cpf);
		if(candidate){
			if(isStep){
				if(!candidate.verify || !candidate.status){
					toast(
						<Toasts
							icon={ 'Close' }
							iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={ 'Erro!'}
						>
							Aprove o candidato antes de avançar de etapa.
						</Toasts>,
						{
							closeButton: true ,
							autoClose: 5000 //
						}
					)
					return
				};
				
			}
			candidate.verify = verify
			candidate.status = status
			if(isStep){
				candidate.step = candidate.step + 1;
			};
			if(isStep == false){
				candidate.step = candidate.step - 1;
			};
		}else{
			toast(
				<Toasts
					icon={ 'Close' }
					iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Erro!'}
				>
					Erro ao atualizar o status do candidato, tente mais tarde.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			setMenu(false)
			return
		}
		const params = {
			candidates:JSON.stringify(Newcandidates)
		}
		const update = await Job(params, dates.id)
		if(update.status == 200 ){
			candidate = candidates.find((item: { cpf: string | undefined; }) => item.cpf === dates.cpf);
			if(isStep){
				candidate.step = candidate.step + 1;
				candidate.verify = null
				candidate.status = null
			}else if(isStep == false){
				candidate.step = candidate.step - 1;
				candidate.verify = null
				candidate.status = null
			}else{
				candidate.verify = verify
				candidate.status = status
			};
			//@ts-ignore
			const stepCandidates = candidates.filter(candidate => candidate.step === step);
			setCandidatesStep(stepCandidates)
			if(isStep === undefined){
				return
			}
			toast(
				<Toasts
					icon={ 'Check' }
					iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Sucesso!'}
				>
					{  isStep ?
						'Candidato avançou para próxima etapa.'
						:
						'Candidato regrediu para etapa anterior.'
					}
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			setMenu(false)
		}else{
			toast(
				<Toasts
					icon={ 'Close' }
					iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Erro!'}
				>
					Erro ao atualizar o status do candidato internamente, verifique sua internet.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			setMenu(false)
		}
	};

	const generateDocumentSignature = async () => {
		setModalSignedDocument(true);
	};

	const finishAdmission = async () => {
		let candidate = candidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
		if(!candidate.verify || !candidate.status){
			toast(
				<Toasts
					icon={ 'Close' }
					iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Erro!'}
				>
					Aprove o candidato antes de avançar de etapa.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			return
		}
		const params = {
			CPF_collaborator:manipulating.cpf
		}
		const update = await Job(params, manipulating.id)
		if(update.status == 200 ){
			const newCandidates = candidates.filter((item: { cpf: string | undefined; }) => item.cpf !== manipulating.cpf);
			setCandidates(newCandidates)
			setCandidatesStep(newCandidates)
			toast(
				<Toasts
					icon={ 'Check' }
					iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Sucesso!'}
				>
					Parabéns, {Mask('firstName',manipulating.name)} foi adicionado(a) a equipe.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			return
		}
		toast(
			<Toasts
				icon={ 'Close' }
				iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
				title={ 'Erro!'}
			>
				Algo deu errado. Tente novamente mais tarde!
			</Toasts>,
			{
				closeButton: true ,
				autoClose: 5000 //
			}
		)
		// console.log('finalizando:', manipulating.name)
	};

	useEffect(()=>{
        const fetchData = async () => {
            const response = await Job_Admissional(userData.cnpj);
			if(response.status == 200){
				//@ts-ignore
				const removeStep0 = response.candidates.filter(candidate => candidate.step !== 0);
				setCandidates(removeStep0)
				//@ts-ignore
				const stepOneCandidates = response.candidates.filter(candidate => candidate.step === 1);
				setCandidatesStep(stepOneCandidates)
				setLoaderTable(true)
				return
			};
			setLoaderTable(true)
        }
        if(userData && userData.cnpj){
            fetchData();
        }
    },[userData]);

	return (
		<section className='h-100'>

			{ menu && (
				<ul 
					id="context-menu"
					onContextMenu={(e)=>e.preventDefault()}
					className='box-shadow-lg rounded-1 flex-col'
					style={{
						position: 'absolute',
						listStyleType: 'none',
						margin: 0,
						width:'240px',
						top: `${menuPosition.y}px`,
						left: `${menuPosition.x}px`,
						padding: '10px',
						backgroundColor: '#fff',
						border: '1px solid #ccc',
						zIndex: 1000,
					}}
				>
					<li >
					{ step < 3 ?
						<Button
							icon='Check'
							color='dark'
							isLink={true}
							onClick={()=>menuController('nextStep')}
						>
							Avançar Etapa
						</Button>
						:
						<Button
							icon='Check'
							color='danger'
							isLink={true}
							onClick={()=>menuController('finishAdmission')}
						>
							Finalizar admissão
						</Button>
					}
					</li>
					{ step > 1 &&
						<li>
							<Button
								icon='KeyboardReturn'
								color='dark'
								isLink={true}
								onClick={()=>menuController('previousStep')}
							>
								Retorna etapa
							</Button>
						</li>
					}
					<li>
						<Button
							icon='PersonSearch'
							color='dark'
							isLink={true}
							onClick={()=>menuController('profile')}
						>
							Perfil
						</Button>
					</li>
					<li>
						<Button
							icon='Assignment'
							color='dark'
							isLink={true}
							onClick={()=>menuController('observation')}
						>
							Adicionar observação
						</Button>
					</li>
					<li>
						<Button
							icon='Markunread'
							color='dark'
							isLink={true}
							onClick={()=>menuController('email')}
						>
							Enviar e-mail
						</Button>
					</li>
					<li>
						<Button
							icon='Textsms'
							color='dark'
							isLink={true}
							onClick={()=>menuController('whatsapp')}
						>
							Conversar no Whatsapp
						</Button>
					</li>
				</ul>
			)}
			
			<Modal isOpen={openDocument} setIsOpen={setOpenDocument} size={`lg`}>
				<ModalHeader>
					<div>
						<h1 className='mb-0 p-0'>Documento</h1>
						<p className='mt-0 p-0'>Avalie o documento</p>
						{manipulatingTable && <span className='text-warning'>{manipulatingTable.name}</span>}
					</div>
				</ModalHeader>
				<ModalBody> 
					{ view == 'signature' ?
						<>
							{typeDocumentSignature == 'pdf' ?
								<iframe
									title="Conteúdo incorporado da página"
									src={pathDocumentSignature}
									className="rounded-md left-5"
									style={{ height: "500px", width: '100%', borderRadius: '10px' }}
								/>
								:
								typeDocumentSignature == 'picture' ?
								<div className='d-flex gap-4'>
									<img
										title="Documento"
										src={pathDocumentSignature}
										className="rounded-md left-5"
										style={{ height: "500px", width: '100%', borderRadius: '10px' }}
									/>
								</div>
								:
								<div>
									<h3>O Candidato ainda não enviou o documento.</h3>
								</div>
							}
						</>
						:
						view == 'documentSignature' ?
							<>
								{typeDocumentSignatureFull == 'pdf' ?
									<iframe
										title="Conteúdo incorporado da página"
										src={pathDocumentSignatureFull}
										className="rounded-md left-5"
										style={{ height: "500px", width: '100%', borderRadius: '10px' }}
									/>
									:
									typeDocumentSignatureFull == 'picture' ?
									<div className='d-flex gap-4'>
										<img
											title="Documento"
											src={pathDocumentSignatureFull}
											className="rounded-md left-5"
											style={{ height: "500px", width: '100%', borderRadius: '10px' }}
										/>
									</div>
									:
									<div>
										<h3>O Candidato ainda não enviou o documento.</h3>
									</div>
								}
							</>
						:
						<>
							{typeDocument == 'pdf' ?
								<iframe
									title="Conteúdo incorporado da página"
									src={pathDocumentMain}
									className="rounded-md left-5"
									style={{ height: "500px", width: '100%', borderRadius: '10px' }}
								/>
								:
								typeDocument == 'picture' ?
								<div className='d-flex gap-4'>
									<img
										title="Documento"
										src={pathDocumentMain}
										className="rounded-md left-5"
										style={{ height: "500px", width: '100%', borderRadius: '10px' }}
									/>
								</div>
								:
								<div>
									<h3>O Candidato ainda não enviou o documento.</h3>
								</div>
							}
						</>

					}
				</ModalBody>
				<ModalFooter>
					{ ((typeDocument && pathDocumentMain && step != 3 ) || 
					  (view == 'signature' && step == 3 && typeDocumentSignature && pathDocumentSignature)) &&
						<div className='d-flex gap-4'>
							<Button
								isLight={true}
								color='danger'
								onClick={()=>AvaliationPicture(false)}
								// size='lg'
							>
								Recusar
							</Button>
							<Button
								isLight={true}
								color='success'
								onClick={()=>AvaliationPicture(true)}
								// size='lg'
							>
								Aprovar
							</Button>
						</div>
					}
				</ModalFooter>
			</Modal>

			{manipulatingTable && <SignedDocument dynamic={isDynamic}  closeAfterSave={closeAfterSaveDocumentSignature} nameDocument={documentAvaliation} id={manipulatingTable.id} modal={modalSignedDocument} setModal={setModalSignedDocument} document={allDocument} assignature={allAssignature} />}

			<Card stretch={isFluid} onClick={closeMenu}>
				<CardHeader borderSize={1}>
					<CardLabel icon='InsertChart' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							Processo de Admissão
						</CardTitle>
					</CardLabel>
					{ candidates && candidates.length > 0 &&
						<div className='d-flex align-items-center justify-content-center gap-2'>
							
							{ step != 1 &&
								<Button
									icon='ArrowBackIos'
									color='warning'
									isLink={true}
									onClick={()=>navegationStep(false)}
								></Button>
							}
							<CardLabel icon={stepIcon} iconColor='warning'>
								<CardTitle tag='div' className='h4'>
									{stepTitle}
								</CardTitle>
							</CardLabel>
							{step != 3 &&
								<Button
									
									icon='ArrowForwardIos'
									color='warning'
									isLink={true}
									onClick={()=>navegationStep(true)}
								></Button>
							}

						</div>
					}
					<CardActions>
						{/* <Button
							color='info'
							icon='CloudDownload'
							isLight
							tag='a'
							to='/somefile.txt'
							target='_blank'
							download>
							Export
						</Button> */}
						<></>
					</CardActions>
				</CardHeader>

				<CardBody className='table-responsive' isScrollable={isFluid} onClick={closeMenu}>
					{ !loaderTable ? 
					<div className='d-flex align-items-center gap-2'>
						{/* <Spinner/> */}
						<h1>🔍 Buscando candidatos</h1>
					</div> :
					candidates  && candidates.length > 0 ?
					<>
						<table className='table table-modern' onClick={closeMenu}>
							<thead>
								<tr>
									<td aria-labelledby='Image' style={{ width: 60 }} />
									<th>Última atualização</th>
									<th>Contato</th>
									<th>Nome</th>
									<th>Contrato</th>
									<th>Função</th>
									<th className='text-center'>Status</th>
									<td aria-labelledby='Actions' />
								</tr>
							</thead>
							<tbody>
								{ dataPagination(candidatesStep, currentPage, perPage).map((item) => (
									<tr key={item.id}  onContextMenu={(e) => toggleMenu(e, item)} >
										<td>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames({
													'border-light': !darkModeStatus,
												})}
												icon='Info'
												onClick={()=>handleUpcomingDetails(item.observation)}
												aria-label='Detailed information'
											/>
										</td>
										<td>
											<div className='d-flex align-items-center'>
												<span
													className={classNames(
														'badge',
														'border border-2',
														[`border-${themeStatus}`],
														'rounded-circle',
														'bg-success',
														'p-2 me-2',
														// `bg-${item.status.color}`,
													)}>
													<span className='visually-hidden'>
														
													</span>
												</span>
												<span className='text-nowrap'>
													{Mask('lastUpdate',item.update_at)}
												</span>
											</div>
										</td>
										<td>
											<div>
												<div>{Mask('phone', item.phone)}</div>
												<div className='small text-muted'>
													{item.email}
												</div>
											</div>
										</td>
										<td>
											<div className='d-flex'>
												<div className='flex-shrink-0'>
													<img
														className='rounded-circle'
														src={item.picture}
														width={36}
														height={36}
														// srcSet={item.assigned.srcSet}
														// color={item.assigned.color}
													/>
												</div>
												<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
													{ `${Mask('firstName', item.name)} ${Mask('secondName', item.name)}` }
												</div>
											</div>
										</td>
										<td className='text-uppercase'>
											{item.contract}
										</td>
										<td>
											{item.function}
											<div className='small text-muted'>
												R$ {priceFormat(item.salary)}
											</div>
										</td>
										<td>
											<DropdownToggle hasIcon={false}>
												<Button
													isLink
													color={item.status && item.verify ?  'success' : item.status == null && item.verify == null  ? 'warning'   : item.status == false && item.verify == null  ? 'light' : 'danger'}
													icon='Circle'
													className='text-nowrap'>
													{item.status && item.verify       ?  'Aprovado' : item.status == null && item.verify == null ? 'Em espera' : item.status == false && item.verify == null  ? 'Rejeitado': 'Reprovado'}
												</Button>
											</DropdownToggle>
										</td>
										<td>
										{ item.step == 1 ?
												<Button
													isOutline={!darkModeStatus}
													color='dark'
													isLight={darkModeStatus}
													className={classNames('text-nowrap col-12 ' , {
														'border-light': !darkModeStatus,
													})}
													icon={!loadingStates[item.cpf] ? 'PhotoLibrary' : 'ImageSearch'}
													onClick={
														()=>{
															actionController(item)
														}}>
													{!loadingStates[item.cpf] ?
													'Visualizar'
													:
													'Buscando'
													}
												</Button>
											:
											item.step == 2 ?
												<Button
													isOutline={!darkModeStatus}
													color='dark'
													isLight={darkModeStatus}
													className={classNames( 'text-nowrap col-12', {
														'border-light': !darkModeStatus,
													})}
													icon={!loadingStates[item.cpf] ? 'LibraryBooks' : 'ImageSearch'}
													onClick={
														()=>{
															actionController(item)
													}}>
													{!loadingStates[item.cpf] ?
													'Gerenciar'
													:
													'Buscando'
													}
												</Button>
												
											:
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames('text-nowrap col-12', {
													'border-light': !darkModeStatus,
												})}
												icon={!loadingStates[item.cpf] ? 'PhotoLibrary': 'ImageSearch'}
												onClick={()=>actionController(item)}>
												{!loadingStates[item.cpf] ?
													'Gerenciar'
													:
													'Buscando'
												}
											</Button>
										}
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<PaginationButtons
							data={candidatesStep}
							label='candidatos'
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
							perPage={perPage}
							setPerPage={setPerPage}
						/>
					</>	
					:
					<div>
						<h2 className='fw-bold'>Nenhuma admissão em andamento</h2>
					</div>
					}
				</CardBody>
			</Card>

			<OffCanvas
				setOpen={setUpcomingEventsInfoOffcanvas}
				isOpen={upcomingEventsInfoOffcanvas}
				titleId='upcomingDetails'
				placement='bottom'>
				{
					<>
						<OffCanvasHeader setOpen={setUpcomingEventsInfoOffcanvas}>
						<OffCanvasTitle id='upcomingDetails'>Observação</OffCanvasTitle>
						</OffCanvasHeader>
						<OffCanvasBody>
							<div className='row'>
								<div className='col-lg-6'>
									<FormGroup
										id='noteInfo'
										label='Note'
										isColForLabel
										labelClassName='col-sm-2 text-capitalize'
										childWrapperClassName='col-sm-10'>
										<Textarea style={{height:'150px'}} value={formik.values.note} readOnly disabled />
									</FormGroup>
								</div>
							
							</div>
						</OffCanvasBody>	
					</>
				}
			</OffCanvas>

			<OffCanvas
				setOpen={handleUpcomingEdit}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				isBackdrop={manipulating ? true : false}
				placement='end'>
				<OffCanvasHeader setOpen={handleUpcomingEdit}>
					<OffCanvasTitle id='upcomingEdit'>
						{titleManipulating}
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>

					<div className='row g-5'>
						{ controllerBodyManipulating == 'kitAdmission' &&
							<>

								<span>
									Abaixo, selecione seus arquivos, e envie para o candidato.
								</span>
									
								<div className='col-12'>
									<Dropdown>
										<DropdownToggle>
											<Button color='light' isLight icon='FolderOpen' className='col-12'>
												Selecione um Documento
											</Button>
										</DropdownToggle>
										<DropdownMenu breakpoint='xxl'>
												<DropdownItem>
													<Button 
															onClick={()=>documentController('add')}
														>
															<Icon icon='AddCircle' /> Adicionar Documento
													</Button>
												</DropdownItem>

											<DropdownItem isHeader>Obrigatórios</DropdownItem>
										
											<DropdownItem>
														<Button
															onClick={()=>documentController('registration_form')}
														>
															<Icon 
																color={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.registration) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.registration)? 'success' : 'warning'}
																icon ={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.registration) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.registration)? 'Check' : 'Info'} 
															/> 
															Ficha de Registro
														</Button>
											</DropdownItem>

											<DropdownItem>
														<Button 
															onClick={()=>documentController('experience_contract')}
														>
															<Icon 
																color={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.experience) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.experience)? 'success': 'warning'}
																icon ={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.experience) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.experience)? 'Check'  : 'Info'} 
															/> 
															Contrato de Experiência
														</Button>
											</DropdownItem>

											<DropdownItem>
														<Button
															onClick={()=>documentController('hours_extension')}
														>
															<Icon 
																color={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.extension) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.extension) ? 'success' : 'warning'}
																icon ={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.extension) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.extension) ? 'Check' : 'Info'} 
															/>  
															Acordo de Prorrogação de Horas
														</Button>
											</DropdownItem>

											<DropdownItem>
														<Button 
															onClick={()=>documentController('hours_compensation')}
														>
															<Icon 
																color={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.compensation) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.compensation) ? 'success' : 'warning'}
																icon ={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.compensation) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.compensation) ? 'Check' : 'Info'} 
															/> 
															Acordo de Compensação de Horas
														</Button>
											</DropdownItem>

											<DropdownItem>
														<Button 
															onClick={()=>documentController('transport_voucher')}
														>
															<Icon 
																color={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.voucher) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.voucher) ? 'success' : 'warning'} 
																icon ={(step == 2 && datesDynamicManipulating && datesDynamicManipulating.obligation.voucher) || (step == 3 && datesDynamicManipulating && datesDynamicManipulating.signature.voucher) ? 'Check' : 'Info'} 
															/> 
															Solicitação de Vale Transporte
														</Button>
											</DropdownItem>
												
											<DropdownItem isDivider />

											<DropdownItem isText>Documentos Adicionais</DropdownItem>
												
											

											<>
												{datesDynamicManipulating && datesDynamicManipulating.dynamic &&
													Object.keys(datesDynamicManipulating.dynamic.document).map((key) => {
														const fileName = datesDynamicManipulating.dynamic.document[key];
														const formattedFileName = fileName.replace(/([a-z])([A-Z])/g, '$1 $2');
														return (
															<DropdownItem key={key}>
															<Button 
															onClick={() => {
																setDocumentAvaliation(datesDynamicManipulating.dynamic.document[key])
																documentController('dynamic', datesDynamicManipulating.dynamic.document[key])
															}}
															>
																<Icon color='warning' icon="Check" /> {formattedFileName}
															</Button>
															</DropdownItem>
														);
													})
												}
											</>

										</DropdownMenu>
									</Dropdown>
								</div>

								
								{documentAvaliation &&
									( loadingSearchDocument  ?
										<div> 
											<h1>Ops, peraí que o documento tá se escondendo...</h1>
												<Spinner />
										</div>
										:
										<>
											{ manipulatingTable && ( documentAvaliation != 'add') && 
												<div className='col-12'>
													<FormGroup id='customerName' 
													label={ 
														documentAvaliation == 'registration_form'  ? 'Ficha de Registro'       :
														documentAvaliation == 'experience_contract'? 'Contrato de Experiencia' :
														documentAvaliation == 'hours_extension'    ? 'Acordo de Prorrogação de Horas' :
														documentAvaliation == 'hours_compensation' ? 'Acordo de Compensação de Horas' : 
														documentAvaliation == 'transport_voucher'  ? 'Solitação de Vale Transporte'   : 
														documentAvaliation.replace(/([a-z])([A-Z])/g, '$1 $2')
													}
													>
														<InputGroup>
															<Input 
																type='file'
																onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
																	const file = event.target.files?.[0]; // Pega o primeiro arquivo selecionado
																	if (file) {
																	formik.setFieldValue('document', file); // Atualiza o valor no Formik
																	}
																}}
															/>
																<Button isOutline color='light' icon={pathDocumentMain ? 'Autorenew' : 'CloudUpload'}>
																	{pathDocumentMain ? 'Edit' : 'Upload'}
																</Button>
														</InputGroup>
													</FormGroup>
												</div>
											}

											{ manipulatingTable && documentAvaliation == 'add' && 
												<>
													<FormGroup id='customerName' label={'Nome do novo documento'}>
															<Input
																id='documentNameAdd'
																type='text'
																value={formik.values.documentNameAdd}
																className='text-capitalize'
																onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
																	formik.setFieldValue('documentNameAdd', event.target.value);
																}}
															/>
													</FormGroup>

													<FormGroup id='customerName'>
														<InputGroup>
															<Input 
																type='file'
																onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
																	const file = event.target.files?.[0];
																	if (file) {
																	formik.setFieldValue('document', file);
																	}
																}}
															/>
																<Button isOutline color='light' icon={pathDocumentMain ? 'Autorenew' : 'CloudUpload'}>
																	{pathDocumentMain ? 'Edit' : 'Upload'}
																</Button>
														</InputGroup>
													</FormGroup>
												</>
											}

											{ pathDocumentMain && typeDocument && 
												<div className='col-12'>
													<FormGroup label='Visualizar' className='gap-2 d-flex flex-column'>
														<div>
															<Button 
																	isLink={true}
																	icon='Description'
																	color='info'
																	onClick={()=>{
																		setView('document')
																		setOpenDocument(true)
																	}}
																>
																	Documento
															</Button>
														</div>
													</FormGroup>
													{
														step == 2 && !['registration_form', 'experience_contract', 'hours_extension', 'hours_compensation', 'transport_voucher'].includes(documentAvaliation) &&
														<FormGroup>
															<div>
																<div>
																	<Button 
																		isLink={true}
																		onClick={deleteDocumentDynamic}
																		icon='Delete'
																		color='danger'
																	>
																		Deletar
																	</Button>
																</div>
															</div>
														</FormGroup>
													}
												</div>
											}
										</>
									)
								}

							</>
						}

						{ controllerBodyManipulating == 'signature' &&
							<>
								<span>
									Abaixo, selecione seus arquivos, confira as assinaturas e gere seu documento assinado. 
								</span>

								<div className='col-12'>
									<Dropdown>
										<DropdownToggle>
											<Button color='light' isLight icon='FolderOpen' className='col-12'>
												Selecione um Documento
											</Button>
										</DropdownToggle>
										<DropdownMenu breakpoint='xxl'>
										
											<DropdownItem>
												<Button
													onClick={()=>documentController('registration_form', '', true)}
														>
														<Icon 
															//@ts-ignore
															color={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'registration_form') && statusAllSignature.some(item => item.picture.toLowerCase().includes('registration_form') && item.status == 'approved' ) ? 'success' : statusAllSignature.some(item => item.picture.toLowerCase().includes('registration_form') && item.status == 'reproved' )? 'danger' : 'warning'}
															//@ts-ignore
															icon ={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'registration_form') && statusAllSignature.some(item => item.picture.toLowerCase().includes('registration_form') && item.status == 'approved' ) ? 'Check'   : statusAllSignature.some(item => item.picture.toLowerCase().includes('registration_form') && item.status == 'reproved' )? 'Close' :' Info'} 
														/> 
														Ficha de Registro
												</Button>
											</DropdownItem>

											<DropdownItem>
												<Button 
															onClick={()=>documentController('experience_contract', '', true)}
														>
															<Icon 
																//@ts-ignore
																color={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'experience_contract' && statusAllSignature.some(item => item.picture.toLowerCase().includes('experience_contract') && item.status == 'approved' )) ? 'success': statusAllSignature.some(item => item.picture.toLowerCase().includes('experience_contract') && item.status == 'approved' ) ? 'Danger' :'warning'}
																//@ts-ignore
																icon ={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'experience_contract' && statusAllSignature.some(item => item.picture.toLowerCase().includes('experience_contract') && item.status == 'approved' )) ? 'Check'  : statusAllSignature.some(item => item.picture.toLowerCase().includes('experience_contract') && item.status == 'approved' ) ? 'Close' :'Info'} 
															/> 
															Contrato de Experiência
												</Button>
											</DropdownItem>

											<DropdownItem>
												<Button
															onClick={()=>documentController('hours_extension', '', true)}
														>
															<Icon 
																//@ts-ignore
																color={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'hours_extension') && statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_extension') && item.status == 'approved' )? 'success' : statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_extension') && item.status == 'reproved' ) ? 'danger' : 'warning'}
																//@ts-ignore
																icon ={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'hours_extension') && statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_extension') && item.status == 'approved' )?  'Check' : statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_extension') && item.status == 'reproved' )  ? 'Close' :'Info'} 
															/>  
															Acordo de Prorrogação de Horas
												</Button>
											</DropdownItem>

											<DropdownItem>
												<Button 
													onClick={()=>documentController('hours_compensation', '', true)}
												>
													<Icon 
														//@ts-ignore
														color={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'hours_compensation' && statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_compensation') && item.status == 'approved' )) ? 'success' : statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_compensation') && item.status == 'reproved' ) ? 'danger' : 'warning'}
														//@ts-ignore
														icon ={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'hours_compensation' && statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_compensation') && item.status == 'approved' )) ? 'Check' : statusAllSignature.some(item => item.picture.toLowerCase().includes('hours_compensation') && item.status == 'reproved' ) ? 'Close':'Info'} 
													/> 
													Acordo de Compensação de Horas
												</Button>
											</DropdownItem>

											<DropdownItem>
												<Button 
															onClick={()=>documentController('transport_voucher', '', true)}
														>
															<Icon 
																//@ts-ignore
																color={statusAllSignature && datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'transport_voucher')  && statusAllSignature.some(item => item.picture.toLowerCase().includes('transport_voucher') && item.status == 'approved' ) ? 'success': statusAllSignature.some(item => item.picture.toLowerCase().includes('transport_voucher') && item.status == 'reproved' ) ? 'danger' : 'warning'} 
																//@ts-ignore
																icon ={statusAllSignature && datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => typeof key === 'string' && key.toLowerCase() === 'transport_voucher') && statusAllSignature.some(item => item.picture.toLowerCase().includes('transport_voucher') && item.status == 'approved' ) ? 'Check' : statusAllSignature.some(item => item.picture.toLowerCase().includes('transport_voucher') && item.status == 'reproved' ) ? 'Close' : 'Info'} 
															/> 
															Solicitação de Vale Transporte
												</Button>
											</DropdownItem>
												
											<DropdownItem isDivider />

											<DropdownItem isText>Documentos Adicionais</DropdownItem>
												
											<>
												{datesDynamicManipulating && datesDynamicManipulating.dynamic &&
													Object.keys(datesDynamicManipulating.dynamic.document).map((key) => {
														const fileName = datesDynamicManipulating.dynamic.document[key];
														const formattedFileName = fileName.replace(/([a-z])([A-Z])/g, '$1 $2');
														return (
															<DropdownItem key={key}>
															<Button 
															onClick={() => {
																setDocumentAvaliation(datesDynamicManipulating.dynamic.document[key])
																documentController('dynamic', datesDynamicManipulating.dynamic.document[key], true)
																setIsDynamic(true)
															}}
															>
																<Icon 
																	//@ts-ignore
																	color={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => key === fileName) && statusAllSignature.some(item => item.picture.toLowerCase().includes(fileName.toLowerCase()) && item.status == 'approved' ) ? 'success' : statusAllSignature.some(item => item.picture.toLowerCase().includes(fileName.toLowerCase()) && item.status == 'reproved' ) ? 'danger' : 'warning'} 
																	//@ts-ignore
																	icon ={datesDynamicManipulating?.documentSignature && Object.values(datesDynamicManipulating.documentSignature).find(key => key === fileName) && statusAllSignature.some(item => item.picture.toLowerCase().includes(fileName.toLowerCase()) && item.status == 'approved' ) ? 'Check'   : statusAllSignature.some(item => item.picture.toLowerCase().includes(fileName.toLowerCase()) && item.status == 'reproved' ) ? 'Close': 'Info'} 
																/> 
																{formattedFileName}
															</Button>
															</DropdownItem>
														);
													})
												}
											</>

										</DropdownMenu>
									</Dropdown>
								</div>

								{ documentAvaliation && (
									loadingSearchDocument  ? 
										<div> 
											<h1>Ops, peraí que o documento tá se escondendo...</h1>
											<Spinner />
										</div>
										:
										<>
												{ documentAvaliation &&
													<h5>
															{
																documentAvaliation == 'registration_form'  ? 'Ficha de Registro'       :
																documentAvaliation == 'experience_contract'? 'Contrato de Experiencia' :
																documentAvaliation == 'hours_extension'    ? 'Acordo de Prorrogação de Horas' :
																documentAvaliation == 'hours_compensation' ? 'Acordo de Compensação de Horas' : 
																documentAvaliation == 'transport_voucher'  ? 'Solitação de Vale Transporte'   : 
																documentAvaliation == 'view' ?  '' : documentAvaliation.replace(/([a-z])([A-Z])/g, '$1 $2')
															}
													</h5>
												}

												{ documentAvaliation &&
													<>
														<FormGroup label='Visualizar' className='gap-2 d-flex flex-column'>
															<div>
																<Button 
																	isLink={true}
																	icon='Description'
																	color='info'
																	onClick={()=>{
																		setView('document')
																		setOpenDocument(true)
																	}}
																>
																	Documento
																</Button>
															</div>
															<div>
																<Button 
																	isLink={true}
																	icon='Mode'
																	color='storybook'
																	onClick={()=>{
																		setView('signature')
																		setOpenDocument(true)
																	}}
																>
																	Assinatura
																</Button>
															</div>
															<>   
																{ typeDocumentSignatureFull && pathDocumentSignatureFull && statusSignature &&
																	<div>
																		<Button 
																			isLink={true}
																			icon='Verified'
																			color='warning'
																			onClick={()=>{
																				setView('documentSignature')
																				setOpenDocument(true)
																			}}
																		>
																			Documento Assinado
																		</Button>
																	</div>
																}
															</>
														</FormGroup>

														{ statusSignature &&
															<FormGroup label='Gerar'>
																<div> 
																	<Button 
																		isLink={true}
																		icon='LibraryAdd'
																		color='success'
																		onClick={generateDocumentSignature}
																	>
																		Documento Assinado
																	</Button>
																</div>
															</FormGroup>
														}
													</>
												}
										</>
									)
								}
							</>
						}

						{ controllerBodyManipulating == 'observation' &&
							<div className='col-12'>
								<Card isCompact borderSize={2} shadow='none' className='mb-0'>
									<CardHeader>
										<CardLabel>
											<CardTitle>Observação</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody >
										<FormGroup id='note' label={manipulating && manipulating.name}>
											<Textarea
												onChange={formik.handleChange}
												value={formik.values.note}
												style={{height:'200px'}}
											/>
										</FormGroup>
									</CardBody>
								</Card>
							</div>
						}

						{/* <div className='col-12'>
							<Card isCompact borderSize={2} shadow='none' className='mb-0'>
								<CardHeader>
									<CardLabel>
										<CardTitle>Notification</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<FormGroup>
										<Checks
											id='notify'
											type='switch'
											label={
												<>
													Notify the Customer
													<Popovers
														trigger='hover'
														desc='Check this checkbox if you want your customer to receive an email about the scheduled appointment'>
														<Icon
															icon='Help'
															size='lg'
															className='ms-1 cursor-help'
														/>
													</Popovers>
												</>
											}
											onChange={formik.handleChange}
											checked={formik.values.notify}
										/>
									</FormGroup>
								</CardBody>
							</Card>
						</div> */}
					</div>

				</OffCanvasBody>
				{ (controllerBodyManipulating == 'kitAdmission'  || controllerBodyManipulating == 'observation') &&
					<div className='row m-0'>
						<div className='col-12 p-3'>
							<Button
								color='info'
								className='w-100'
								onClick={()=>formSubmitController(controllerBodyManipulating)}>
								{ SpinnerManipulating ?
									<Spinner 
										isSmall={true}
									/>
									:
									'Salvar'
								}
							</Button>
						</div>
					</div>
				}
			</OffCanvas>
		</section>
	);
};
AdmissionTable.defaultProps = {
	isFluid: false,
};

export default AdmissionTable;


