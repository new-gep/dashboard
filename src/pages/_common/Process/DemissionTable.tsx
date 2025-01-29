import React, { FC, useContext, useEffect, useState, useRef } from 'react';
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
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
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
import Job_Check_Dismissal from '../../../api/get/job/Job_Check_Dismissal';
import Job_Dynamic from '../../../api/delete/job/job_dynamic';
import SignedDocument from '../../../components/canva/SignedDocument';
import Signatures from '../../../api/get/picture/Admission_Signatures';
//
import Job_Demissional from '../../../api/get/job/Job_Demissional';
import DismissalSignatures from '../../../api/get/picture/Dismissal_Signatures';
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
const DemissionTable: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const navigate = useNavigate();

	const [step, setStep] = useState(1);
	const [stepTitle, setStepTitle] = useState('Comunicado');
	const [stepIcon, setIcon] = useState('LooksOne');
	const { userData } = useContext(AuthContext);
	const [collaborators, setCollaborators] = useState<null | any>(null);
	const [collaboratorsStep, setCollaboratorsStep] = useState<null | any>(null);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [menu, setMenu] = useState<boolean>(false);
	const [manipulating, setManipulating] = useState<null | any>(null);
	const [loaderTable, setLoaderTable] = useState<boolean>(false);
	const [manipulatingTable, setManipulatingTable] = useState<null | any>(null);
	const [titleManipulating, setTitleManipulating] = useState<null | any>(null);
	const [datesDynamicManipulating, setDatesDynamicManipulating] = useState<null | any>(null);
	const [controllerBodyManipulating, setControllerBodyManipulating] = useState<null | any>(null);
	const [SpinnerManipulating, setSpinnerManipulating] = useState<Boolean>(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);
	const [openDocument, setOpenDocument] = useState<boolean>(false);
	const [avalidDocument, setAvalidDocument] = useState<boolean>(false);
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
	const [allAssignature, setAllAssignature] = useState<any>(null);
	const [allDocument, setAllDocument] = useState<any>(null);
	const [modalSignedDocument, setModalSignedDocument] = useState<boolean>(false);
	const [isDynamic, setIsDynamic] = useState<boolean>(false);
	const [statusSignature, setStatusSignature] = useState<boolean | null>(false);
	const [statusAllSignature, setStatusAllSignature] = useState<any>(false);
	const inputFile = useRef<HTMLInputElement>(null);

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
			note: '',
			notify: true,
		},
	});

	const handleUpcomingDetails = (job: any) => {
		setManipulatingTable(job);
		formik.setFieldValue('note', job.note);
		if (upcomingEventsInfoOffcanvas) {
			setManipulatingTable(false);
		}
		setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
	};

	const handleUpcomingEdit = () => {
		if (upcomingEventsEditOffcanvas) {
			setDocumentAvaliation(null);
			setManipulatingTable(null);
			setPathDocumentMain(null);
			setTypeDocument(null);
			setSpinnerManipulating(false);
			setIsDynamic(false);
		}
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};

	const closeAfterSaveDocumentSignature = async () => {
		setDocumentAvaliation(null)
		setPathDocumentMain(null)
		setTypeDocument(null)
		setPathDocumentSignature(null)
		setTypeDocumentSignature(null)
		setAllDocument(null)
		setAllAssignature(null)
		setStatusSignature(null)
		setPathDocumentSignatureFull(null)
		setTypeDocumentSignatureFull(null)
		const response = await Job_Check_Dismissal(manipulatingTable.id)
		if(response.status == 200){
			setDatesDynamicManipulating(response.date)
			// const obligation = Object.keys(response.date.obligation);
			let dynamic = Object.values(response.date.dynamic.communication.document);
			let signature = response.date.dynamic.communication.complet

		
			dynamic = dynamic
			//@ts-ignore
			.map(item => item.replace(/^\/+|\/+$/g, '').replace(/\//g, '').trim())  // Remove barras no começo e final
			//@ts-ignore
			.filter(item => item !== "");

			signature = Object.values(signature)
			//@ts-ignore
			.map(item => item.replace(/^\/+|\/+$/g, '').replace(/\//g, '').trim())  // Remove barras no começo e final
			//@ts-ignore
			.filter(item => item !== "");

			const documentDynamic = dynamic.every(document =>
				Object.values(signature)
				//@ts-ignore
				  .filter(value => value.trim() !== "") // Ignorar valores vazios
				  .includes(document)
			);

			if(documentDynamic){
				updateStatusCandidate(manipulatingTable, null, true);
			};
		}
		return;
		// return new Promise(async (resolve, reject) => {
		//   try {
		// 	let allSignatureApproved:boolean = false
		// 	const response = await Job_Check_Admissional(manipulatingTable.id);
		// 	if (response.status === 200) {
		// 	  setDatesDynamicManipulating(response.date);
		// 	  const obligation = Object.keys(response.date.obligation);
		// 	  let dynamic = Object.values(response.date.dynamic.signature)
		// 	  //@ts-ignore
		// 		.map(item => item.replace(/^\/+|\/+$/g, '').trim()) // Remove barras no começo e final
		// 		.filter(item => item !== ""); // Filtra valores vazios

		// 	  const documentSignatures = Object.values(response.date.documentSignature);

		// 	  const obligationExists = obligation.every(required =>
		// 		documentSignatures.some(signature =>
		// 			//@ts-ignore
		// 		  signature.toLowerCase().includes(required.toLowerCase())
		// 		)
		// 	  );

		// 	  const dynamicExists = dynamic.every(required =>
		// 		documentSignatures.some(signature =>
		// 			//@ts-ignore
		// 		  signature.toLowerCase().includes(required.toLowerCase())
		// 		)
		// 	  );
		// 	  const responseSignature = await Signatures(manipulatingTable.cpf);
		// 	  //@ts-ignore
		// 	  allSignatureApproved = responseSignature.pictures.every(picture => picture.status === 'approved');
		// 	  if (obligationExists && dynamicExists && allSignatureApproved) {
		// 		updateStatusCandidate(manipulatingTable, true, true);
		// 	  }
		// 	  setDocumentAvaliation(null);
		// 	  setPathDocumentMain(null);
		// 	  setTypeDocument(null);
		// 	  setIsDynamic(false);
		// 	  //@ts-ignore
		// 	  resolve(); // Indica que a Promise foi resolvida com sucesso
		// 	} else {
		// 	  reject(new Error("Response status is not 200")); // Caso o status não seja 200, rejeita a Promise
		// 	}
		//   } catch (error) {
		// 	reject(error); // Em caso de erro, rejeita a Promise
		//   }
		// });
	};

	const toggleMenu = (e: any, colaborator: any) => {
		setManipulating(colaborator);
		e.preventDefault();
		if (menu) {
			setMenu(false);
			return;
		}
		setMenuPosition({ x: e.clientX, y: e.clientY });
		setMenu(true);
	};

	const closeMenu = () => {
		setMenu(false);
		setManipulating(null);
	};

	const formSubmitController = async (action: string, update:any = null) => {
		let fileName;
		let paramsJobPictureDismissal;
		let response;
		switch (action) {
			case 'communication':
				setSpinnerManipulating(true);
				if ((!formik.values.document || !formik.values.documentNameAdd)	&& !update) {
					toast(
						<Toasts icon={'Close'} iconColor={'danger'} title={'Erro!'}>
							Antes de salvar, é necessário fazer o upload do arquivo e informar o
							nome que ele deverá ter.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					return;
				}
				fileName = formik.values.documentNameAdd
					.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
					.replace(/^\w/, (c) => c.toUpperCase())
					.replace(/\s+/g, '');

				paramsJobPictureDismissal = {
					file: update ? update.file : formik.values.document,
					name: 'dismissal_communication_dynamic',
					id: manipulatingTable.id,
					signature: false,
					dynamic: update ? update.name :fileName,
				};
				response = await JobPicture(paramsJobPictureDismissal);
				if (response.status == 200) {
					const response = await Job_Check_Dismissal(manipulatingTable.id)
					setDatesDynamicManipulating(response.date)
					formik.setFieldValue('document', '');
					formik.setFieldValue('documentNameAdd', '');
					toast(
						<Toasts icon={'Check'} iconColor={'success'} title={'Sucesso!'}>
							O arquivo foi salvo com sucesso.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					updateStatusCandidate(manipulatingTable, null, null);
					setDocumentAvaliation(null);
					setIsDynamic(false);
				} else {
					toast(
						<Toasts icon={'Close'} iconColor={'danger'} title={'Erro!'}>
							Erro ao salvar o documento, tente mais tarde.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
				}
				setSpinnerManipulating(false);
				break;
			case 'kitDismissal':
				setSpinnerManipulating(true);
				if ((!formik.values.document || !formik.values.documentNameAdd)	&& !update) {
					toast(
						<Toasts icon={'Close'} iconColor={'danger'} title={'Erro!'}>
							Antes de salvar, é necessário fazer o upload do arquivo e informar o
							nome que ele deverá ter.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					return;
				}
				fileName = formik.values.documentNameAdd
					.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
					.replace(/^\w/, (c) => c.toUpperCase())
					.replace(/\s+/g, '');

				paramsJobPictureDismissal = {
					file: update ? update.file : formik.values.document,
					name: 'dismissal_kit_dynamic',
					id: manipulatingTable.id,
					signature: false,
					dynamic: update ? update.name :fileName,
				};
				response = await JobPicture(paramsJobPictureDismissal);
				if (response.status == 200) {
					const response = await Job_Check_Dismissal(manipulatingTable.id)
					setDatesDynamicManipulating(response.date)
					formik.setFieldValue('document', '');
					formik.setFieldValue('documentNameAdd', '');
					toast(
						<Toasts icon={'Check'} iconColor={'success'} title={'Sucesso!'}>
							O arquivo foi salvo com sucesso.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					updateStatusCandidate(manipulatingTable, null, null);
					setDocumentAvaliation(null);
					setIsDynamic(false);
				} else {
					toast(
						<Toasts icon={'Close'} iconColor={'danger'} title={'Erro!'}>
							Erro ao salvar o documento, tente mais tarde.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
				}
				setSpinnerManipulating(false);
				break;
			default:
				console.log(action);
				break;
		}
		return;
		// switch (action) {
		// 	case 'observation' :
		// 		setSpinnerManipulating(true)
		// 		//@ts-ignore
		// 		const Newcandidates = candidates.map(({ cpf, step, status, verify, observation }) => ({ cpf, step, status, verify, observation }));
		// 		const candidate = Newcandidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
		// 		if(candidate){
		// 			candidate.observation = formik.values.note;
		// 		}else{
		// 			setSpinnerManipulating(false)
		// 			return
		// 		}
		// 		const params = {
		// 			candidates:JSON.stringify(Newcandidates)
		// 		}
		// 		const update = await Job(params, manipulating.id)
		// 		if(update.status == 200 ){
		// 			const candidate = candidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
		// 			candidate.observation = formik.values.note;
		// 			//@ts-ignore
		// 			const stepCandidates = candidates.filter(candidate => candidate.step === step);
		// 			setCandidatesStep(stepCandidates)
		// 			setSpinnerManipulating(false)
		// 		}else{
		// 			setSpinnerManipulating(false)
		// 			console.log('não foi possível salvar a VAGA tabela (job)')
		// 		}
		// 		break
		// 	case 'kitAdmission':
		// 		let document:string;
		// 		if(documentAvaliation == 'add'){
		// 			if(!formik.values.document || !formik.values.documentNameAdd){
		// 				toast(
		// 						<Toasts
		// 							icon={ 'Close' }
		// 							iconColor={ 'danger' }
		// 							title={ 'Erro!'}
		// 						>
		// 							Antes de salvar, é necessário fazer o upload do arquivo e informar o nome que ele deverá ter.
		// 						</Toasts>,
		// 						{
		// 							closeButton: true ,
		// 							autoClose: 5000 //
		// 						}
		// 				)
		// 				return
		// 			};
		// 			setSpinnerManipulating(true);
		// 			const fileName = formik.values.documentNameAdd
		// 			.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
		// 			.replace(/^\w/, (c) => c.toUpperCase())
		// 			.replace(/\s+/g, "");

		// 			const paramsJobPicture = {
		// 				file:formik.values.document,
		// 				name:'dynamic',
		// 				id  :manipulatingTable.id,
		// 				signature:false,
		// 				dynamic:fileName
		// 			};

		// 			const response = await JobPicture(paramsJobPicture)
		// 			if(response.status == 200){
		// 				setSpinnerManipulating(false)
		// 				formik.setFieldValue('document', '');
		// 				formik.setFieldValue('documentNameAdd', '');
		// 				toast(
		// 					<Toasts
		// 						icon={ 'Check' }
		// 						iconColor={ 'success' }
		// 						title={ 'Sucesso!'}
		// 					>
		// 						O arquivo foi salvo com sucesso.
		// 					</Toasts>,
		// 					{
		// 						closeButton: true ,
		// 						autoClose: 5000 //
		// 					}
		// 				)
		// 				handleUpcomingEdit()
		// 				return
		// 			};
		// 		}
		// 		if(!formik.values.document){
		// 			toast(
		// 					<Toasts
		// 						icon={ 'Close' }
		// 						iconColor={ 'danger' }
		// 						title={ 'Erro!'}
		// 					>
		// 						Antes de salvar, você deve fazer o upload do arquivo
		// 					</Toasts>,
		// 					{
		// 						closeButton: true ,
		// 						autoClose: 5000 //
		// 					}
		// 			)
		// 			return
		// 		};
		// 		setSpinnerManipulating(true);
		// 		switch (documentAvaliation) {
		// 			case 'registration_form':
		// 				document = 'registration'
		// 				break;
		// 			case 'experience_contract':
		// 				document = 'experience'
		// 				break;
		// 			case 'hours_extension':
		// 				document = 'extension'
		// 				break;
		// 			case 'hours_compensation':
		// 				document = 'compensation'
		// 				break;
		// 			case 'transport_voucher':
		// 				document = 'voucher'
		// 				break;
		// 		}
		// 		const paramsJobPicture = {
		// 			file:formik.values.document,
		// 			//@ts-ignore
		// 			name:document,
		// 			id  :manipulatingTable.id,
		// 			signature:false
		// 		};
		// 		const response = await JobPicture(paramsJobPicture)
		// 		if(response.status == 200){
		// 			const response = await Job_Check_Admissional(manipulatingTable.id)
		// 			if(response.status == 200){
		// 				setDatesDynamicManipulating(response.date);
		// 				const obligationValues = Object.values(response.date.obligation); // Obtém um array com os valores das propriedades
		// 				const allTrue = obligationValues.every(value => value === true);

		// 				if (allTrue) {
		// 				  updateStatusCandidate(manipulatingTable, true, true);
		// 				}
		// 			}
		// 			setSpinnerManipulating(false)
		// 			formik.setFieldValue('document', '');
		// 			toast(
		// 				<Toasts
		// 					icon={ 'Check' }
		// 					iconColor={ 'success' }
		// 					title={ 'Sucesso!'}
		// 				>
		// 					O arquivo foi salvo com sucesso.
		// 				</Toasts>,
		// 				{
		// 					closeButton: true ,
		// 					autoClose: 5000 //
		// 				}
		// 			)
		// 			handleUpcomingEdit()
		// 			return
		// 		}
		// 	break
		// };
		setSpinnerManipulating(false);
		handleUpcomingEdit();
	};

	const menuController = async (action: string) => {
		let candidate;
		let params;
		let update;
		let Newcandidates;

		switch (action) {
			case 'cancelDemission':
				cancelDemission(manipulating);
				break;
			case 'finishDismissal':
				finishDismissal()
				break;
			case 'nextStep':
				updateStatusCandidate(manipulating, true);
				break;
			case 'previousStep':
				updateStatusCandidate(manipulating, false);
				break;
			case 'profile':
				navigate(`/collaborator/profile/${manipulating.CPF_collaborator}`);
				break;
			case 'observation':
				setTitleManipulating('Adicione uma Observação');
				setControllerBodyManipulating('observation');
				formik.setFieldValue(
					'note',
					manipulating.observation ? manipulating.observation : '',
				);
				setUpcomingEventsEditOffcanvas(true);
				break;
			case 'email':
				const encodedSubject = encodeURIComponent('Assunto');
				const encodedBody = encodeURIComponent('Digite seu texto');
				const mailtoURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${manipulating.email}&su=${encodedSubject}&body=${encodedBody}`;

				window.open(mailtoURL, '_blank');
				break;
			case 'whatsapp':
				const whatsappURL = `https://wa.me/55${manipulating.phone}`;
				window.open(whatsappURL, '_blank');
				break;
		}
		setMenu(false);
	};

	const documentController = async (
		document: any,
		dynamic?: any,
		signature?: any,
		dates?: any,
	) => {
		setPathDocumentMain(null)
		setTypeDocument(null)
		setPathDocumentSignature(null)
		setTypeDocumentSignature(null)
		setAllDocument(null)
		setAllAssignature(null)
		setStatusSignature(null)
		setPathDocumentSignatureFull(null)
		setTypeDocumentSignatureFull(null)
		
		let responseDocument;
		let responseSignature
		
		if(!dynamic){
			setIsDynamic(false)
		}
		setLoadingSearchDocument(true)
		switch (document) {
			case 'dismissal_hand':
				responseDocument = await JobFile(dates.id, 'dismissal_hand', '0');
				break;
			case 'dynamic':
				responseSignature = await JobFile(manipulatingTable.id, 'dismissal_dynamic', '1', dynamic);
				responseDocument  = await JobFile(manipulatingTable.id, 'dismissal_dynamic', '0', dynamic);
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
				break;
			case 'dismissal_communication_dynamic':
				responseSignature = await JobFile(manipulatingTable.id, 'dismissal_communication_dynamic', '1', dynamic.replace(/\//g, ''));
				responseDocument  = await JobFile(manipulatingTable.id, 'dismissal_communication_dynamic', '0', dynamic.replace(/\//g, ''));
			
				const formattedFileNameNew = dynamic.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\//g, '');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						{formattedFileNameNew}
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'dismissal_kit_dynamic':
				responseSignature = await JobFile(manipulatingTable.id, 'dismissal_communication_dynamic', '1', dynamic.replace(/\//g, ''));
				responseDocument  = await JobFile(manipulatingTable.id, 'dismissal_communication_dynamic', '0', dynamic.replace(/\//g, ''));
			
				const formattedFileNameNewKit = dynamic.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\//g, '');
				toast(
					<Toasts
						icon={ 'Check' }
						iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={ 'Sucesso!'}
					>
						{formattedFileNameNewKit}
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 5000 //
					}
				)
				break;
			case 'add':
				setDocumentAvaliation('add');
				break;
		}

		if(step == 1 && manipulatingTable.demission.solicitation == 'company'){
			const response = await DismissalSignatures(manipulatingTable.CPF_collaborator);
			if(response.status == 200){
				setStatusAllSignature(response.pictures)
				if(document != 'dismissal_communication_dynamic'){
					//@ts-ignore
					const filteredPictures = response.pictures.some(item => item.picture.toLowerCase().includes(document) && item.status == 'approved' );
					setStatusSignature(filteredPictures);
				}else{
					//@ts-ignore
					const filteredPictures = response.pictures.some(item =>
						item.picture.toLowerCase() === `dismissal_signature_communication` &&
						item.status === 'approved'
					 );					  
					setStatusSignature(filteredPictures);
				}
			}
		};

		if(step == 3){
			console.log('aqui step 3')
			const response = await DismissalSignatures(manipulatingTable.CPF_collaborator);
			if(response.status == 200){
				setStatusAllSignature(response.pictures)
				if(document != 'dismissal_kit_dynamic'){
					//@ts-ignore
					const filteredPictures = response.pictures.some(item => item.picture.toLowerCase().includes(document) && item.status == 'approved' );
					setStatusSignature(filteredPictures);
				}else{
					//@ts-ignore
					const filteredPictures = response.pictures.some(item =>
						item.picture.toLowerCase() === `dismissal_signature_kit` &&
						item.status === 'approved'
					 );					  
					setStatusSignature(filteredPictures);
				}
			}
		};

		if (responseDocument && responseDocument.status == 200) {
			
			setAllDocument(responseDocument);
			setPathDocumentMain(responseDocument.path);
			setTypeDocument(responseDocument.type);
		}
		if(responseSignature  && responseSignature.status == 200){
			setAllAssignature(responseSignature)
			setPathDocumentSignature(responseSignature.path)
			setTypeDocumentSignature(responseSignature.type)
			setTypeDocumentSignatureFull(responseSignature.typeDocumentSignature ? responseSignature.typeDocumentSignature : null)
			setPathDocumentSignatureFull(responseSignature.pathDocumentSignature ? responseSignature.pathDocumentSignature : null)
		};
		setLoadingSearchDocument(false)

		// dismissal_hand

		// setPathDocumentMain(null)
		// setTypeDocument(null)
		// setPathDocumentSignature(null)
		// setTypeDocumentSignature(null)
		// setAllDocument(null)
		// setAllAssignature(null)
		// setLoadingSearchDocument(true)
		// if(!dynamic){
		// 	setIsDynamic(false)
		// }

		// let responseSignature;
		// let responseDocument;

		// switch (document) {
		// 	case 'registration_form':
		// 		setDocumentAvaliation(document)
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'registration', '1')
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'registration', '0');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				Ficha de Registro
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		);
		// 		break;
		// 	case 'experience_contract':
		// 		setDocumentAvaliation(document)
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'experience', '1')
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'experience', '0');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				Contrato de Experiencia
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		break;
		// 	case 'hours_extension':
		// 		setDocumentAvaliation(document)
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'extension', '1')
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'extension', '0');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				Acordo de Prorrogação de Horas
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		break;
		// 	case 'hours_compensation':
		// 		setDocumentAvaliation(document)
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'compensation', '1')
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'compensation', '0');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				Acordo de Compensação de Horas
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		break;
		// 	case 'transport_voucher':
		// 		setDocumentAvaliation(document)
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'voucher', '1')
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'voucher', '0');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				Solitação de Vale Transporte
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		break;
		// 	case 'dynamic':
		// 		if(signature){
		// 			responseSignature = await JobFile(manipulatingTable.id, 'dynamic', '1', dynamic);
		// 		}
		// 		responseDocument = await JobFile(manipulatingTable.id, 'dynamic', '0', dynamic);
		// 		//@ts-ignore
		// 		const formattedFileName = dynamic.replace(/([a-z])([A-Z])/g, '$1 $2');
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Check' }
		// 				iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
		// 				title={ 'Sucesso!'}
		// 			>
		// 				{formattedFileName}
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		break
		// 	case 'add':
		// 		setDocumentAvaliation('add')
		// 		break
		// 	default:
		// 		break;
		// };

		// if(step == 3){
		// 	const response = await Signatures(manipulatingTable.cpf);
		// 	if(response.status == 200){
		// 		setStatusAllSignature(response.pictures)
		// 		if(document != 'dynamic'){
		// 			//@ts-ignore
		// 			const filteredPictures = response.pictures.some(item => item.picture.toLowerCase().includes(document) && item.status == 'approved' );
		// 			setStatusSignature(filteredPictures);
		// 		}else{
		// 			//@ts-ignore
		// 			const filteredPictures = response.pictures.some(item => item.picture.includes(dynamic) && item.status == 'approved' );
		// 			setStatusSignature(filteredPictures);
		// 		}
		// 	}
		// };

		// if(responseDocument  && responseDocument.status == 200){
		// 	setAllDocument(responseDocument)
		// 	setPathDocumentMain(responseDocument.path)
		// 	setTypeDocument(responseDocument.type)
		// };

		// if(responseSignature  && responseSignature.status == 200){
		// 	setAllAssignature(responseSignature)
		// 	setPathDocumentSignature(responseSignature.path)
		// 	setTypeDocumentSignature(responseSignature.type)
		// 	setTypeDocumentSignatureFull(responseSignature.typeDocumentSignature ? responseSignature.typeDocumentSignature : null)
		// 	setPathDocumentSignatureFull(responseSignature.pathDocumentSignature ? responseSignature.pathDocumentSignature : null)
		// };

		// setLoadingSearchDocument(false)
	};

	const actionController = async (job: any) => {
		let response;
		switch (job.demission.step) {
			case 1:
				if (job.demission.solicitation == 'collaborator') {
					setLoadingStates((prevStates) => ({
						...prevStates,
						[collaborators.CPF_collaborator]: true,
					}));
					documentController('dismissal_hand', null, null, job);
					setManipulatingTable(job);
					setControllerBodyManipulating('communication');
					setTitleManipulating('Gerencie seu Comunicado');
					handleUpcomingEdit();
					setLoadingStates((prevStates) => ({
						...prevStates,
						[collaborators.CPF_collaborator]: false,
					}));
				}
				if (job.demission.solicitation == 'company') {
					setLoadingStates((prevStates) => ({
						...prevStates,
						[collaborators.CPF_collaborator]: true,
					}));
					response = await Job_Check_Dismissal(job.id)
					console.log('response',response)
					if(response.status == 200){
						setDatesDynamicManipulating(response.date);
						// const obligation = Object.keys(response.date.obligation);
						let dynamic = Object.values(response.date.dynamic.communication.document);
						let signature = response.date.dynamic.communication.complet	
						// console.log('dynamic',dynamic)
						// console.log('signature',signature)
						if(dynamic){
							dynamic = dynamic
							//@ts-ignore
							.map(item => item.replace(/^\/+|\/+$/g, '').replace(/\//g, '').trim())  // Remove barras no começo e final
							//@ts-ignore
							.filter(item => item !== "");
						}
						if(signature){
							signature = Object.values(signature)
							//@ts-ignore
							.map(item => item.replace(/\//g, '').trim())  // Remove todas as barras
							//@ts-ignore
							.filter(item => item !== "");

							const documentDynamic = dynamic.every(document =>
								Object.values(signature)
								//@ts-ignore
								.filter(value => value.trim().replace(/\//g, '') !== "") // Ignorar valores vazios
								.includes(document)
							);


							if(documentDynamic){
								updateStatusCandidate(job, null, true);
							};
						}
					}
					setManipulatingTable(job);
					setControllerBodyManipulating('communication');
					setTitleManipulating('Gerencie seu Comunicado');
					handleUpcomingEdit();
					setLoadingStates((prevStates) => ({
						...prevStates,
						[collaborators.CPF_collaborator]: false,
					}));
				}
				break;
			case 2:
				setLoadingStates((prevStates) => ({
					...prevStates,
					[collaborators.CPF_collaborator]: true,
				}));
				setAvalidDocument(true)
				setManipulatingTable(job);
				response = await JobFile(job.id,'dismissal_medical','0' ,'0')
				if(response.status == 200){
					setDocumentAvaliation('medical_examination')
					setPathDocumentMain(response.path)
					setTypeDocument(response.type)
					setOpenDocument(true)
					setLoadingStates(prevStates => ({ ...prevStates, [collaborators.CPF_collaborator]: false }));
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
						O candidato ainda não enviou o exame demissional.
					</Toasts>,
					{
						closeButton: true ,
						autoClose: 3000 
					}
				)
				setLoadingStates((prevStates) => ({
					...prevStates,
					[collaborators.CPF_collaborator]: false,
				}));
				break;
			case 3:
				setLoadingStates((prevStates) => ({
					...prevStates,
					[collaborators.CPF_collaborator]: true,
				}));
				response = await Job_Check_Dismissal(job.id)
				if(response.status == 200){
					setDatesDynamicManipulating(response.date)
					// const obligation = Object.keys(response.date.obligation);
					let dynamic = Object.values(response.date.dynamic.document);
					let signature = response.date.documentSignature
					dynamic = dynamic
					//@ts-ignore
					.map(item => item.replace(/^\/+|\/+$/g, '').trim())  // Remove barras no começo e final
					//@ts-ignore
					.filter(item => item !== "");
					const documentDynamic = dynamic.every(document =>
						Object.values(signature)
						//@ts-ignore
						  .filter(value => value.trim() !== "") // Ignorar valores vazios
						  .includes(document)
					);
					if(documentDynamic){
						updateStatusCandidate(job);
					};
				}
				setManipulatingTable(job);
				setControllerBodyManipulating('kitDismissal');
				setTitleManipulating('Gerencie seu Kit Demissional');
				handleUpcomingEdit();
				setLoadingStates((prevStates) => ({
					...prevStates,
					[collaborators.CPF_collaborator]: false,
				}));
				break
			default:
				break;
		}
		return;
		// let response;
		// switch (candidate.step) {
		// 	case 1:
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
		// 		setManipulatingTable(candidate)
		// 		response = await CollaboratorFile(candidate.cpf, 'medical_examination');
		// 		if(response.status == 200){
		// 			setDocumentAvaliation('medical_examination')
		// 			setPathDocumentMain(response.path)
		// 			setTypeDocument(response.type)
		// 			setOpenDocument(true)
		// 			setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
		// 			return
		// 		}
		// 		toast(
		// 			<Toasts
		// 				icon={ 'Close' }
		// 				iconColor={ 'danger' }
		// 				title={ 'Erro!'}
		// 			>
		// 				O candidato ainda não enviou o exame admissional.
		// 			</Toasts>,
		// 			{
		// 				closeButton: true ,
		// 				autoClose: 5000 //
		// 			}
		// 		)
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
		// 		break;
		// 	case 2:
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
		// 		setDocumentAvaliation(null)
		// 		response = await Job_Check_Admissional(candidate.id)
		// 		if(response.status == 200){
		// 			setDatesDynamicManipulating(response.date)
		// 			const obligationValues = Object.values(response.date.obligation); // Obtém um array com os valores das propriedades
		// 			const allTrue = obligationValues.every(value => value === true);
		// 			if (allTrue) {
		// 				updateStatusCandidate(candidate, true);
		// 			}
		// 		}
		// 		setManipulatingTable(candidate)
		// 		setControllerBodyManipulating('kitAdmission');
		// 		setTitleManipulating('Gerencie seu Kit Admissional');
		// 		handleUpcomingEdit();
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
		// 		break;
		// 	case 3:
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: true }));
		// 		setManipulatingTable(candidate)
		// 		response = await Signatures(candidate.cpf);
		// 		let allSignatureApproved:boolean = false
		// 		if(response.status == 200){
		// 			//@ts-ignore
		// 			allSignatureApproved = response.pictures.every(picture => picture.status === 'approved');
		// 			setStatusAllSignature(response.pictures)
		// 		}else{
		// 			setStatusAllSignature(null)
		// 		}
		// 		response = await Job_Check_Admissional(candidate.id)
		// 		if(response.status == 200){
		// 			setDatesDynamicManipulating(response.date)
		// 			const obligation = Object.keys(response.date.obligation);
		// 			let dynamic = Object.values(response.date.dynamic.signature);
		// 			dynamic = dynamic
		// 			//@ts-ignore
		// 			.map(item => item.replace(/^\/+|\/+$/g, '').trim())  // Remove barras no começo e final
		// 			.filter(item => item !== "");;
		// 			const documentSignatures = Object.values(response.date.documentSignature)
		// 			const obligationExists = obligation.every(required =>
		// 				documentSignatures.some(signature =>
		// 					//@ts-ignore
		// 					signature.toLowerCase().includes(required.toLowerCase())
		// 				)
		// 			);
		// 			const dynamicExists = dynamic.every(required =>
		// 				documentSignatures.some(signature =>
		// 				  //@ts-ignore
		// 				  signature.toLowerCase().includes(required.toLowerCase())
		// 				)
		// 			);
		// 			if (obligationExists && dynamicExists && allSignatureApproved) {
		// 				updateStatusCandidate(candidate, true);
		// 			};
		// 		};
		// 		setControllerBodyManipulating('signature');
		// 		setTitleManipulating('Gerencie as Assinaturas');
		// 		handleUpcomingEdit();
		// 		setLoadingStates(prevStates => ({ ...prevStates, [candidate.cpf]: false }));
		// 		break;
		// }
	};

	const navegationStep = async (navigation: boolean) => {
		let newStep;
		setPathDocumentMain(null);
		setTypeDocument(null);

		if (navigation) {
			setStep(step + 1);
			newStep = step + 1;
		} else {
			setStep(step - 1);
			newStep = step - 1;
		}
		//@ts-ignore
		const stepCandidates = collaborators.filter(
			(collaborators: any) => collaborators.demission.step === newStep,
		);
		setCollaboratorsStep(stepCandidates);

		switch (newStep) {
			case 1:
				setIcon('LooksOne');
				setStepTitle('Comunicado');

				break;
			case 2:
				setIcon('LooksTwo');
				setStepTitle('Exame Demissional');
				break;
			case 3:
				setIcon('Looks3');
				setStepTitle('Assinaturas');
				break;
		}
	};

	const AvaliationPicture = async (avaliation: boolean) => {
		try {
			const params = {
				status: avaliation ? 'approved' : 'reproved',
				picture:
					view == 'signature' && step == 1
						? `Dismissal_Signature_Communication`
						: `Dismissal_Signature_Kit`,
				id_user: userData.id,
			};
			const response: any = await PicturePath(params, manipulatingTable.CPF_collaborator);
			if (response.status == 200) {
				switch (manipulatingTable.demission.step) {
					case 1:
						if (avaliation) {
							setStatusSignature(true)
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Assinatura aprovada com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						} else {
							updateStatusCandidate(manipulatingTable, null, false);
							setStatusSignature(false)
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Assinatura rejeitada com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						}
						setOpenDocument(false);
						return;
					case 2:
						if (avaliation) {
							updateStatusCandidate(manipulatingTable, null, true);
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Exame Demissional aprovado com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						} else {
							updateStatusCandidate(manipulatingTable, null, false);
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Exame Demissional rejeitado com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						}
						setOpenDocument(false);
						return;
					case 3:
						if (avaliation) {
							setStatusSignature(true)
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Assinatura aprovada com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						} else {
							setStatusSignature(false)
							updateStatusCandidate(manipulatingTable, null, false);
							toast(
								<Toasts
									icon={'Check'}
									iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
									title={'Sucesso!'}>
									Assinatura rejeitada com sucesso
								</Toasts>,
								{
									closeButton: true,
									autoClose: 5000, //
								},
							);
						}
						setOpenDocument(false);
						return;
					default:
						console.log('step indefinido, ou manipulado não setado');
						break;
				}
			} else {
				toast(
					<Toasts
						icon={'Close'}
						iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
						title={'Erro!'}>
						Algo deu errado. Tente mais tarde!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 5000, //
					},
				);
			}
		} catch (e) {
			console.log('erro:', e);
			toast(
				<Toasts
					icon={'Close'}
					iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Erro!'}>
					Erro ao atualizar documento do candidato, tente mais tarde e verifique sua
					internet.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 5000, //
				},
			);
		}
	};

	const deleteDocumentDynamic = async () => {
		let response;
		switch (manipulatingTable.demission.step) {
			case 1:
				response = await Job_Dynamic(documentAvaliation, manipulatingTable.id, 'communication');
				if (response && response.status == 200) {
					handleUpcomingEdit();
					toast(
						<Toasts
							icon={'Check'}
							iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Sucesso!'}>
							Documento deletado com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					return;
				}else{
					toast(
						<Toasts
							icon={'Close'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro!'}>
							Erro ao deletar documento, tente mais tarde e verifique sua internet.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
				}
				break;
			case 3:
				response = await Job_Dynamic(documentAvaliation, manipulatingTable.id, 'kitDismissal');
				if (response && response.status == 200) {
					handleUpcomingEdit();
					toast(
						<Toasts
							icon={'Check'}
							iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Sucesso!'}>
							Documento deletado com sucesso!
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
					return;
				}else{
					toast(
						<Toasts
							icon={'Close'}
							iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
							title={'Erro!'}>
							Erro ao deletar documento, tente mais tarde e verifique sua internet.
						</Toasts>,
						{
							closeButton: true,
							autoClose: 5000, //
						},
					);
				}
				break;
			default:
				break;
		}
	};

	const updateStatusCandidate = async (dates: any, isStep:any = null, newStatus:any = null) => {
		setDocumentAvaliation(null)
		setPathDocumentMain(null)
		setTypeDocument(null)
		setPathDocumentSignature(null)
		setTypeDocumentSignature(null)
		setAllDocument(null)
		setAllAssignature(null)
		const step = dates.demission.step;
		const status = dates.demission.status;

		if(isStep == null){
			if(newStatus){
				dates.demission.status = true;
			}else if(newStatus == false){
				dates.demission.status = false;
			}else{
				dates.demission.status = null;
			}
			const params = {
				demission: JSON.stringify(dates.demission)
			};
			const update = await Job(params, dates.id)
			if (update.status == 200) {
				const stepCollaborator = collaborators.filter(
					(collaborator: any) => collaborator.demission.step === step,
				);
				setCollaboratorsStep(stepCollaborator);
			}
			return
		}

		if (isStep && !status) {
			toast(
				<Toasts
					icon={'Close'}
					iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Erro!'}>
					Aprove o colaborador antes de avançar de etapa.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 5000, //
				},
			);
			return;
		}

		if (isStep) {
			dates.demission.step = step + 1;
			dates.demission.status = null;
		} else {
			dates.demission.step = step - 1;
			dates.demission.status = null;
		}

		const params = {
			demission: JSON.stringify(dates.demission),
		};

		const update = await Job(params, dates.id);
		if (update.status == 200) {
			let newCollaborators = collaborators.find(
				(item: any) => item.cpf === dates.CPF_collaborator,
			);

			if (isStep) {
				newCollaborators = dates.demission.step = step + 1;
				newCollaborators = dates.demission.status = null;
			} else {
				newCollaborators = dates.demission.step = step - 1;
				newCollaborators = dates.demission.status = null;
			}

			const stepCollaborator = collaborators.filter(
				(collaborator: any) => collaborator.demission.step === step,
			);
			setCollaboratorsStep(stepCollaborator);
			toast(
				<Toasts
					icon={'Check'}
					iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Sucesso'}>
					{isStep
						? 'Colaborador avançou para próxima etapa.'
						: 'Colaborador avançou para etapa anterior.'}
				</Toasts>,
				{
					closeButton: true,
					autoClose: 5000, //
				},
			);
			return;
		}
		toast(
			<Toasts
				icon={'Close'}
				iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
				title={'Erro!'}>
				Não foi possível atualizar o colaborador, tente mais tarde!
			</Toasts>,
			{
				closeButton: true,
				autoClose: 5000, //
			},
		);
	};

	const generateDocumentSignature = async () => {
		setModalSignedDocument(true);
	};

	const finishDismissal = async () => {
		if(!manipulating.demission.status || !manipulating.demission.status){
			toast(
				<Toasts
					icon={ 'Close' }
					iconColor={ 'danger' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Erro!'}
				>
					Aprove o colaborador antes de finalizar a demissão.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
			return
		};
		manipulating.demission.step = step + 1
		manipulating.demission.status = null
		const params = {
			demission: JSON.stringify(manipulating)
		};
		const update = await Job(params, manipulating.id);
		if(update.status == 200){	
			const stepCollaborator = collaborators.filter(
				(collaborator: any) => collaborator.demission.step === step,
			);
			setCollaboratorsStep(stepCollaborator);
			toast(
				<Toasts
					icon={ 'Check' }
					iconColor={ 'success' } // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={ 'Sucesso!'}
				>
					Parabéns, {Mask('firstName',manipulating.name)} foi removido(a) da equipe.
				</Toasts>,
				{
					closeButton: true ,
					autoClose: 5000 //
				}
			)
		}
		
	};

	const cancelDemission = async (job: any) => {
		const updateJob = {
			motion_demission: null,
			demission: null,
			user_edit: userData.id,
		};

		const response = await Job(updateJob, job.id);

		if (response.status == 200) {
			const filteredCollaborators = collaborators.filter(
				(item: any) => item.CPF_collaborator !== job.CPF_collaborator,
			);

			const stepCollaborator = filteredCollaborators.filter(
				(collaborator: any) => collaborator.demission.step === step,
			);
			setCollaborators(filteredCollaborators);
			setCollaboratorsStep(stepCollaborator);

			toast(
				<Toasts
					icon={'Check'}
					iconColor={'success'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
					title={'Sucesso'}>
					Processo de demissão <b>cancelado</b> com sucesso
				</Toasts>,
				{
					closeButton: true,
					autoClose: 5000, //
				},
			);
			return;
		}
		toast(
			<Toasts
				icon={'Close'}
				iconColor={'danger'} // 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
				title={'Erro!'}>
				Erro interno, tente mais tarde!
			</Toasts>,
			{
				closeButton: true,
				autoClose: 5000, //
			},
		);
	};

	const alterDocument = async () =>{
		if (inputFile.current) {
			inputFile.current.click(); // Simula um clique no input
		  } else {
			console.error('Referência do input não está definida');
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try{
				const response = await Job_Demissional(userData.cnpj);
				if (response.status == 200) {
					const stepOneCollaborators = response.job.filter(
						(job: { demission: { step: number } }) => job.demission.step === 1,
					);
					setCollaboratorsStep(stepOneCollaborators);
					return;
				}
			}catch(e){
				console.log(e)
			} finally {
				setLoaderTable(true);
			}
		};
		if (userData && userData.cnpj) {
			fetchData();
		}
	}, [userData]);

	return (
		<section className='h-100'>
			{menu && (
				<ul
					id='context-menu'
					onContextMenu={(e) => e.preventDefault()}
					className='box-shadow-lg rounded-1 flex-col'
					style={{
						position: 'absolute',
						listStyleType: 'none',
						margin: 0,
						width: '240px',
						top: `${menuPosition.y}px`,
						left: `${menuPosition.x}px`,
						padding: '10px',
						backgroundColor: '#fff',
						border: '1px solid #ccc',
						zIndex: 1000,
					}}>
					<li>
						{step < 3 ? (
							<Button
								icon='Check'
								color='dark'
								isLink={true}
								onClick={() => menuController('nextStep')}>
								Avançar Etapa
							</Button>
						) : (
							<Button
								icon='Check'
								color='danger'
								isLink={true}
								onClick={() => menuController('finishDismissal')}>
								Finalizar demissão
							</Button>
						)}
					</li>
					{step > 1 ? (
						<li>
							<Button
								icon='KeyboardReturn'
								color='dark'
								isLink={true}
								onClick={() => menuController('previousStep')}>
								Retorna etapa
							</Button>
						</li>
					) : (
						<li>
							<Button
								icon='Close'
								color='danger'
								isLink={true}
								onClick={() => menuController('cancelDemission')}>
								Cancelar Demissão
							</Button>
						</li>
					)}
					<li>
						<Button
							icon='PersonSearch'
							color='dark'
							isLink={true}
							onClick={() => menuController('profile')}>
							Perfil
						</Button>
					</li>
					<li>
						<Button
							icon='Assignment'
							color='dark'
							isLink={true}
							onClick={() => menuController('observation')}>
							Adicionar observação
						</Button>
					</li>
					<li>
						<Button
							icon='Markunread'
							color='dark'
							isLink={true}
							onClick={() => menuController('email')}>
							Enviar e-mail
						</Button>
					</li>
					<li>
						<Button
							icon='Textsms'
							color='dark'
							isLink={true}
							onClick={() => menuController('whatsapp')}>
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
						{manipulatingTable && (
							<span className='text-warning'>{manipulatingTable.name}</span>
						)}
					</div>
				</ModalHeader>
				<ModalBody>
					{view == 'signature' ? (
						<>
							{typeDocumentSignature == 'pdf' ? (
								<iframe
									title='Conteúdo incorporado da página'
									src={pathDocumentSignature}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							) : typeDocumentSignature == 'picture' ? (
								<div className='d-flex gap-4'>
									<img
										title='Documento'
										src={pathDocumentSignature}
										className='rounded-md left-5'
										style={{
											height: '500px',
											width: '100%',
											borderRadius: '10px',
										}}
									/>
								</div>
							) : (
								<div>
									<h3>O Candidato ainda não enviou o documento.</h3>
								</div>
							)}
						</>
					) : view == 'documentSignature' ? (
						<>
							{typeDocumentSignatureFull == 'pdf' ? (
								<iframe
									title='Conteúdo incorporado da página'
									src={pathDocumentSignatureFull}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							) : typeDocumentSignatureFull == 'picture' ? (
								<div className='d-flex gap-4'>
									<img
										title='Documento'
										src={pathDocumentSignatureFull}
										className='rounded-md left-5'
										style={{
											height: '500px',
											width: '100%',
											borderRadius: '10px',
										}}
									/>
								</div>
							) : (
								<div>
									<h3>O Candidato ainda não enviou o documento.</h3>
								</div>
							)}
						</>
					) : (
						<>
							{typeDocument == 'pdf' ? (
								<iframe
									title='Conteúdo incorporado da página'
									src={pathDocumentMain}
									className='rounded-md left-5'
									style={{ height: '500px', width: '100%', borderRadius: '10px' }}
								/>
							) : typeDocument == 'picture' ? (
								<div className='d-flex gap-4'>
									<img
										title='Documento'
										src={pathDocumentMain}
										className='rounded-md left-5'
										style={{
											height: '500px',
											width: '100%',
											borderRadius: '10px',
										}}
									/>
								</div>
							) : (
								<div>
									<h3>O Candidato ainda não enviou o documento.</h3>
								</div>
							)}
						</>
					)}
				</ModalBody>
				<ModalFooter>
				{ avalidDocument &&
					<div className='d-flex gap-4'>
						<Button
							isLight={true}
							color='danger'
							onClick={() => AvaliationPicture(false)}
						>
							Recusar
						</Button>
						<Button
							isLight={true}
							color='success'
							onClick={() => AvaliationPicture(true)}
						>
							Aprovar
						</Button>
					</div>
				}

				</ModalFooter>
			</Modal>

			{manipulatingTable && (
				<SignedDocument
					where={'dismissal'}
					dynamic={isDynamic}
					closeAfterSave={closeAfterSaveDocumentSignature}
					nameDocument={documentAvaliation}
					id={manipulatingTable.id}
					modal={modalSignedDocument}
					setModal={setModalSignedDocument}
					document={allDocument}
					assignature={allAssignature}
				/>
			)}

			<Card stretch={isFluid} onClick={closeMenu}>
				<CardHeader borderSize={1}>
					<CardLabel icon='InsertChart' iconColor='danger'>
						<CardTitle tag='div' className='h5'>
							Processo de Demissão
						</CardTitle>
					</CardLabel>

					{collaborators && collaborators.length > 0 && (
						<div className='d-flex align-items-center justify-content-center gap-2'>
							{step != 1 && (
								<Button
									icon='ArrowBackIos'
									color='warning'
									isLink={true}
									onClick={() => navegationStep(false)}></Button>
							)}
							<CardLabel icon={stepIcon} iconColor='warning'>
								<CardTitle tag='div' className='h4'>
									{stepTitle}
								</CardTitle>
							</CardLabel>
							{step != 3 && (
								<Button
									icon='ArrowForwardIos'
									color='warning'
									isLink={true}
									onClick={() => navegationStep(true)}></Button>
							)}
						</div>
					)}
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
					{!loaderTable ? (
						<div className='d-flex align-items-center gap-2'>
							{/* <Spinner/> */}
							<h1>🔍 Buscando candidatos</h1>
						</div>
					) : collaborators && collaborators.length > 0 ? (
						<>
							<table className='table table-modern' onClick={closeMenu}>
								<thead>
									<tr>
										<td aria-labelledby='Image' style={{ width: 60 }} />
										<th>Solicitação de Demissão</th>
										<th>Contato</th>
										<th>Nome</th>
										<th>Contrato</th>
										<th>Função</th>
										<th className='text-center'>Status</th>
										<td aria-labelledby='Actions' />
									</tr>
								</thead>
								<tbody>
									{dataPagination(collaboratorsStep, currentPage, perPage).map(
										(item) => (
											<tr
												key={item.id}
												onContextMenu={(e) => toggleMenu(e, item)}>
												<td>
													<Button
														isOutline={!darkModeStatus}
														color='dark'
														isLight={darkModeStatus}
														className={classNames({
															'border-light': !darkModeStatus,
														})}
														icon='Info'
														onClick={() => handleUpcomingDetails(item)}
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
															<span className='visually-hidden'></span>
														</span>
														<span className='text-nowrap'>
															{item &&
															item.demission.solicitation == 'company'
																? 'Empresa'
																: 'Colaborador'}
														</span>
													</div>
												</td>
												<td>
													<div>
														<div>
															{Mask('phone', item.collaborator.phone)}
														</div>
														<div className='small text-muted'>
															{item.collaborator.email}
														</div>
													</div>
												</td>
												<td>
													<div className='d-flex'>
														<div className='flex-shrink-0'>
															<img
																className='rounded-circle'
																src={item.collaborator.picture}
																width={36}
																height={36}
																// srcSet={item.assigned.srcSet}
																// color={item.assigned.color}
															/>
														</div>
														<div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
															{`${Mask('firstName', item.collaborator.name)} ${Mask('secondName', item.collaborator.name)}`}
														</div>
													</div>
												</td>
												<td className='text-uppercase'>{item.contract}</td>
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
															color={
																item.demission.status
																	? 'success'
																	: item.demission.status == null
																		? 'warning'
																		: item.demission.status ==
																			  false
																			? 'light'
																			: 'danger'
															}
															icon='Circle'
															className='text-nowrap'>
															{item.demission.status
																? 'Aprovado'
																: item.demission.status == null
																	? 'Em espera'
																	: item.demission.status == false
																		? 'Rejeitado'
																		: 'Reprovado'}
														</Button>
													</DropdownToggle>
												</td>
												<td>
													{item.step == 1 ? (
														<Button
															isOutline={!darkModeStatus}
															color='dark'
															isLight={darkModeStatus}
															className={classNames(
																'text-nowrap col-12 ',
																{
																	'border-light': !darkModeStatus,
																},
															)}
															icon={
																!loadingStates[item.cpf]
																	? 'PhotoLibrary'
																	: 'ImageSearch'
															}
															onClick={() => {
																actionController(item);
															}}>
															{!loadingStates[item.cpf]
																? 'Visualizar'
																: 'Buscando'}
														</Button>
													) : item.step == 2 ? (
														<Button
															isOutline={!darkModeStatus}
															color='dark'
															isLight={darkModeStatus}
															className={classNames(
																'text-nowrap col-12',
																{
																	'border-light': !darkModeStatus,
																},
															)}
															icon={
																!loadingStates[item.cpf]
																	? 'LibraryBooks'
																	: 'ImageSearch'
															}
															onClick={() => {
																actionController(item);
															}}>
															{!loadingStates[item.cpf]
																? 'Gerenciar'
																: 'Buscando'}
														</Button>
													) : (
														<Button
															isOutline={!darkModeStatus}
															color='dark'
															isLight={darkModeStatus}
															className={classNames(
																'text-nowrap col-12',
																{
																	'border-light': !darkModeStatus,
																},
															)}
															icon={
																!loadingStates[item.cpf]
																	? 'PhotoLibrary'
																	: 'ImageSearch'
															}
															onClick={() => actionController(item)}>
															{!loadingStates[item.cpf]
																? 'Gerenciar'
																: 'Buscando'}
														</Button>
													)}
												</td>
											</tr>
										),
									)}
								</tbody>
							</table>

							<PaginationButtons
								data={collaboratorsStep}
								label='candidatos'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</>
					) : (
						<div>
							<h2 className='fw-bold'>Nenhuma demissão em andamento</h2>
						</div>
					)}
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
										<Textarea
											style={{ height: '150px' }}
											value={formik.values.note}
											readOnly
											disabled
										/>
									</FormGroup>
								</div>
								<div className='col-lg-6'>
									<p className='text-white'>
										Motivo:{' '}
										{manipulatingTable && manipulatingTable.motion_demission}
									</p>
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
					<OffCanvasTitle id='upcomingEdit'>{titleManipulating}</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-5'>
						{controllerBodyManipulating == 'communication' && (
							<>
								{manipulatingTable &&
								manipulatingTable.demission.solicitation == 'company' ? (
									<>
										<span>
											Abaixo, selecione e adicione seus arquivos, e envie para
											o colaborador.
										</span>

										<div className='col-12'>
											<Dropdown>
												<DropdownToggle>
													<Button
														color='light'
														isLight
														icon='FolderOpen'
														className='col-12'>
														Selecione um Documento
													</Button>
												</DropdownToggle>

												<DropdownMenu breakpoint='xxl'>
													<DropdownItem>
														<Button
															onClick={() =>
																documentController('add')
															}>
															<Icon icon='AddCircle' /> Adicionar
															Documento
														</Button>
													</DropdownItem>

													{/* <DropdownItem isHeader>Obrigatórios</DropdownItem>
												
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
													</DropdownItem> */}

													<DropdownItem isDivider />

													<DropdownItem isText>
														Documentos Adicionais
													</DropdownItem>

													<>
														{datesDynamicManipulating &&
															datesDynamicManipulating.dynamic.communication &&
															Object.keys(
																datesDynamicManipulating.dynamic.communication
																	.document,
															).map((key) => {
																const fileName =
																	datesDynamicManipulating.dynamic.communication
																		.document[key];
																const formattedFileName =
																	fileName.replace(
																		/([a-z])([A-Z])/g,
																		'$1 $2',
																	).replace(/\//g, '');
																return (
																	<DropdownItem key={key}>
																		<Button
																			onClick={() => {
																				setDocumentAvaliation(
																					datesDynamicManipulating
																						.dynamic.communication
																						.document[
																						key
																					].replace(/\//g, ''),
																				);
																				documentController(
																					'dismissal_communication_dynamic',
																					datesDynamicManipulating
																						.dynamic.communication
																						.document[
																						key
																					],
																				);
																				setIsDynamic(true);
																			}}>
																			<Icon
																				color='warning'
																				icon='Check'
																			/>{' '}
																			{formattedFileName}
																		</Button>
																	</DropdownItem>
																);
															})}
													</>
												</DropdownMenu>
											</Dropdown>
										</div>

										{(documentAvaliation && documentAvaliation != 'add') &&
											(loadingSearchDocument ? (
												<div>
													<h1>Ops, peraí que o documento tá se escondendo...</h1>
													<Spinner />
												</div>
											) : (
												<>
													{documentAvaliation && (
														<h5>
															{documentAvaliation == 'registration_form'
																? 'Ficha de Registro'
																: documentAvaliation ==
																	'experience_contract'
																	? 'Contrato de Experiencia'
																	: documentAvaliation ==
																		'hours_extension'
																		? 'Acordo de Prorrogação de Horas'
																		: documentAvaliation ==
																			'hours_compensation'
																			? 'Acordo de Compensação de Horas'
																			: documentAvaliation ==
																				'transport_voucher'
																				? 'Solitação de Vale Transporte'
																				: documentAvaliation ==
																					'view'
																					? ''
																					: documentAvaliation.replace(
																							/([a-z])([A-Z])/g,
																							'$1 $2',
																						).replace(/\//g, '')}
														</h5>
													)}

													{documentAvaliation && (
														<>
															
															<FormGroup
																label='Ações'
																className='gap-2 d-flex flex-column'>
																<input
																	className='d-none'
																	ref={inputFile}
																	type='file'
																	accept='application/pdf'
																	onChange={(
																		event: React.ChangeEvent<HTMLInputElement>,
																	) => {
																		const file = event.target.files?.[0];
																		if (file) {
																			// Verifica se o arquivo é um PDF
																			if (file.type === 'application/pdf') {
																				const nameDocument = documentAvaliation.replace(/([a-z])([A-Z])/g,'$1 $2',)
																				const fileName = nameDocument
																				.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
																				.replace(/^\w/, (c) => c.toUpperCase())
																				.replace(/\s+/g, '');

																				const updateProps = {
																					file:file,
																					name:fileName
																				}
																				formSubmitController('communication', updateProps);
																			} else {
																				toast(
																					<Toasts
																						icon={'Close'}
																						iconColor={'danger'}
																						title={'Erro!'}>
																						Envie apenas{' '}
																						<span>PDF</span>, não
																						aceitamos outros tipos de
																						documentos.
																					</Toasts>,
																					{
																						closeButton: true,
																						autoClose: 5000, //
																					},
																				);
																				return;
																			}
																		}
																	}}
																/>												
																<div>
																	<Button
																		isLink={true}
																		icon='Delete'
																		color='danger'
																		onClick={deleteDocumentDynamic}>
																		Deletar Documento
																	</Button>
																</div>
																<div>
																	<Button
																		isLink={true}
																		icon='Sync'
																		color='info'
																		onClick={alterDocument}>
																		Atualizar Documento
																	</Button>
																</div>
																
															</FormGroup>

															<FormGroup
																label='Visualizar'
																className='gap-2 d-flex flex-column'>
																<div>
																	<Button
																		isLink={true}
																		icon='Description'
																		color='info'
																		onClick={() => {
																			setAvalidDocument(false)
																			setView('document');
																			setOpenDocument(true);
																		}}>
																		Documento
																	</Button>
																</div>
																<div>
																	<Button
																		isLink={true}
																		icon='Mode'
																		color='storybook'
																		onClick={() => {
																			setAvalidDocument(true)
																			setView('signature');
																			setOpenDocument(true);
																		}}>
																		Assinatura
																	</Button>
																</div>
																<>
																	{typeDocumentSignatureFull &&
																		pathDocumentSignatureFull &&
																		statusSignature && (
																			<div>
																				<Button
																					isLink={true}
																					icon='Verified'
																					color='warning'
																					onClick={() => {
																						setView(
																							'documentSignature',
																						);
																						setOpenDocument(
																							true,
																						);
																					}}>
																					Documento Assinado
																				</Button>
																			</div>
																		)}
																</>
															</FormGroup>

															{statusSignature && (
																<FormGroup label='Gerar'>
																	<div>
																		<Button
																			isLink={true}
																			icon='LibraryAdd'
																			color='success'
																			onClick={
																				generateDocumentSignature
																			}>
																			Documento Assinado
																		</Button>
																	</div>
																</FormGroup>
															)}
														</>
													)}
												</>
											))
										}
									</>
								) : (
									<>
										<span>
											Abaixo, está a carta de demissão do colaborador.
										</span>

										<div className='col-12'>
											<Button
												className='col-12'
												icon='Markunread'
												color='secondary'
												isLight={true}
												onClick={() => {
													setView(null);
													setAvalidDocument(true)
													setOpenDocument(true);
												}}
												size={'lg'}>
												Carta a Punho
											</Button>
										</div>
									</>
								)}

								{documentAvaliation == 'add' && (
									<>
										<FormGroup
											id='customerName'
											label={'Nome do novo documento'}>
											<Input
												id='documentNameAdd'
												type='text'
												value={formik.values.documentNameAdd}
												className='text-capitalize'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>,
												) => {
													formik.setFieldValue(
														'documentNameAdd',
														event.target.value,
													);
												}}
											/>
										</FormGroup>

										<FormGroup id='customerName'>
											<InputGroup>
												<Input
													
													type='file'
													accept='application/pdf'
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>,
													) => {
														const file = event.target.files?.[0];
														if (file) {
															// Verifica se o arquivo é um PDF
															if (file.type === 'application/pdf') {
																// Se for PDF, atualiza o campo no formik
																formik.setFieldValue(
																	'document',
																	file,
																);
															} else {
																toast(
																	<Toasts
																		icon={'Close'}
																		iconColor={'danger'}
																		title={'Erro!'}>
																		Envie apenas{' '}
																		<span>PDF</span>, não
																		aceitamos outros tipos de
																		documentos.
																	</Toasts>,
																	{
																		closeButton: true,
																		autoClose: 5000, //
																	},
																);
																return;
															}
														}
													}}
												/>
												<Button
													isOutline
													color='light'
													icon={
														pathDocumentMain
															? 'Autorenew'
															: 'CloudUpload'
													}>
													{pathDocumentMain ? 'Edit' : 'Upload'}
												</Button>
											</InputGroup>
										</FormGroup>
									</>
								)}					
							</>
						)}

						{controllerBodyManipulating == 'kitDismissal' && (
							<>
								{manipulatingTable &&
									<>
										<span>
											Abaixo, selecione e adicione seus arquivos, e envie para
											o colaborador.
										</span>

										<div className='col-12'>
											<Dropdown>
												<DropdownToggle>
													<Button
														color='light'
														isLight
														icon='FolderOpen'
														className='col-12'>
														Selecione um Documento
													</Button>
												</DropdownToggle>

												<DropdownMenu breakpoint='xxl'>
													<DropdownItem>
														<Button
															onClick={() =>
																documentController('add')
															}>
															<Icon icon='AddCircle' /> Adicionar
															Documento
														</Button>
													</DropdownItem>

													{/* <DropdownItem isHeader>Obrigatórios</DropdownItem>
												
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
													</DropdownItem> */}

													<DropdownItem isDivider />

													<DropdownItem isText>
														Documentos Adicionais
													</DropdownItem>

													<>
														{datesDynamicManipulating &&
															datesDynamicManipulating.dynamic &&
															Object.keys(
																datesDynamicManipulating.dynamic
																	.document,
															).map((key) => {
																const fileName =
																	datesDynamicManipulating.dynamic
																		.document[key];
																const formattedFileName =
																	fileName.replace(
																		/([a-z])([A-Z])/g,
																		'$1 $2',
																	);
																return (
																	<DropdownItem key={key}>
																		<Button
																			onClick={() => {
																				setDocumentAvaliation(
																					datesDynamicManipulating
																						.dynamic
																						.document[
																						key
																					],
																				);
																				documentController(
																					'dismissal_kit_dynamic',
																					datesDynamicManipulating
																						.dynamic
																						.document[
																						key
																					],
																				);
																				setIsDynamic(true);
																			}}>
																			<Icon
																				color='warning'
																				icon='Check'
																			/>{' '}
																			{formattedFileName}
																		</Button>
																	</DropdownItem>
																);
															})}
													</>
												</DropdownMenu>
											</Dropdown>
										</div>

										{(documentAvaliation && documentAvaliation != 'add') &&
											(loadingSearchDocument ? (
												<div>
													<h1>Ops, peraí que o documento tá se escondendo...</h1>
													<Spinner />
												</div>
											) : (
												<>
													{documentAvaliation && (
														<h5>
															{documentAvaliation == 'registration_form'
																? 'Ficha de Registro'
																: documentAvaliation ==
																	'experience_contract'
																	? 'Contrato de Experiencia'
																	: documentAvaliation ==
																		'hours_extension'
																		? 'Acordo de Prorrogação de Horas'
																		: documentAvaliation ==
																			'hours_compensation'
																			? 'Acordo de Compensação de Horas'
																			: documentAvaliation ==
																				'transport_voucher'
																				? 'Solitação de Vale Transporte'
																				: documentAvaliation ==
																					'view'
																					? ''
																					: documentAvaliation.replace(
																							/([a-z])([A-Z])/g,
																							'$1 $2',
																						)}
														</h5>
													)}

													{documentAvaliation && (
														<>
															
															<FormGroup
																label='Ações'
																className='gap-2 d-flex flex-column'>
																<input
																	className='d-none'
																	ref={inputFile}
																	type='file'
																	accept='application/pdf'
																	onChange={(
																		event: React.ChangeEvent<HTMLInputElement>,
																	) => {
																		const file = event.target.files?.[0];
																		if (file) {
																			// Verifica se o arquivo é um PDF
																			if (file.type === 'application/pdf') {
																				const nameDocument = documentAvaliation.replace(/([a-z])([A-Z])/g,'$1 $2',)
																				const fileName = nameDocument
																				.replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
																				.replace(/^\w/, (c) => c.toUpperCase())
																				.replace(/\s+/g, '');

																				const updateProps = {
																					file:file,
																					name:fileName
																				}
																				formSubmitController('kitDismissal', updateProps);
																			} else {
																				toast(
																					<Toasts
																						icon={'Close'}
																						iconColor={'danger'}
																						title={'Erro!'}>
																						Envie apenas{' '}
																						<span>PDF</span>, não
																						aceitamos outros tipos de
																						documentos.
																					</Toasts>,
																					{
																						closeButton: true,
																						autoClose: 5000, //
																					},
																				);
																				return;
																			}
																		}
																	}}
																/>												
																<div>
																	<Button
																		isLink={true}
																		icon='Delete'
																		color='danger'
																		onClick={deleteDocumentDynamic}>
																		Deletar Documento
																	</Button>
																</div>
																<div>
																	<Button
																		isLink={true}
																		icon='Sync'
																		color='info'
																		onClick={alterDocument}>
																		Atualizar Documento
																	</Button>
																</div>
																
															</FormGroup>

															<FormGroup
																label='Visualizar'
																className='gap-2 d-flex flex-column'>
																<div>
																	<Button
																		isLink={true}
																		icon='Description'
																		color='info'
																		onClick={() => {
																			setView('document');
																			setOpenDocument(true);
																		}}>
																		Documento
																	</Button>
																</div>
																<div>
																	<Button
																		isLink={true}
																		icon='Mode'
																		color='storybook'
																		onClick={() => {
																			setAvalidDocument(true)
																			setView('signature');
																			setOpenDocument(true);
																		}}>
																		Assinatura
																	</Button>
																</div>
																<>
																	{typeDocumentSignatureFull &&
																		pathDocumentSignatureFull &&
																		statusSignature && (
																			<div>
																				<Button
																					isLink={true}
																					icon='Verified'
																					color='warning'
																					onClick={() => {
																						setView(
																							'documentSignature',
																						);
																						setOpenDocument(
																							true,
																						);
																					}}>
																					Documento Assinado
																				</Button>
																			</div>
																		)}
																</>
															</FormGroup>

															{statusSignature && (
																<FormGroup label='Gerar'>
																	<div>
																		<Button
																			isLink={true}
																			icon='LibraryAdd'
																			color='success'
																			onClick={
																				generateDocumentSignature
																			}>
																			Documento Assinado
																		</Button>
																	</div>
																</FormGroup>
															)}
														</>
													)}
												</>
											))
										}
									</>
								}

								{documentAvaliation == 'add' && (
									<>
										<FormGroup
											id='customerName'
											label={'Nome do novo documento'}>
											<Input
												id='documentNameAdd'
												type='text'
												value={formik.values.documentNameAdd}
												className='text-capitalize'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>,
												) => {
													formik.setFieldValue(
														'documentNameAdd',
														event.target.value,
													);
												}}
											/>
										</FormGroup>

										<FormGroup id='customerName'>
											<InputGroup>
												<Input
													type='file'
													accept='application/pdf'
													onChange={(
														event: React.ChangeEvent<HTMLInputElement>,
													) => {
														const file = event.target.files?.[0];
														if (file) {
															// Verifica se o arquivo é um PDF
															if (file.type === 'application/pdf') {
																// Se for PDF, atualiza o campo no formik
																formik.setFieldValue(
																	'document',
																	file,
																);
															} else {
																toast(
																	<Toasts
																		icon={'Close'}
																		iconColor={'danger'}
																		title={'Erro!'}>
																		Envie apenas{' '}
																		<span>PDF</span>, não
																		aceitamos outros tipos de
																		documentos.
																	</Toasts>,
																	{
																		closeButton: true,
																		autoClose: 5000, //
																	},
																);
																return;
															}
														}
													}}
												/>
												<Button
													isOutline
													color='light'
													icon={
														pathDocumentMain
															? 'Autorenew'
															: 'CloudUpload'
													}>
													{pathDocumentMain ? 'Edit' : 'Upload'}
												</Button>
											</InputGroup>
										</FormGroup>
									</>
								)}

								{/* {documentAvaliation &&
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
								} */}
							</>
						)}

						{controllerBodyManipulating == 'observation' && (
							<div className='col-12'>
								<Card isCompact borderSize={2} shadow='none' className='mb-0'>
									<CardHeader>
										<CardLabel>
											<CardTitle>Observação</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<FormGroup
											id='note'
											label={manipulating && manipulating.name}>
											<Textarea
												onChange={formik.handleChange}
												value={formik.values.note}
												style={{ height: '200px' }}
											/>
										</FormGroup>
									</CardBody>
								</Card>
							</div>
						)}

					</div>
				</OffCanvasBody>
				{(controllerBodyManipulating == 'communication' || controllerBodyManipulating == 'kitDismissal') && documentAvaliation == 'add' && (
					<div className='row m-0'>
						<div className='col-12 p-3'>
							<Button
								color='info'
								className='w-100'
								onClick={() => formSubmitController(controllerBodyManipulating)}>
								{SpinnerManipulating ? <Spinner isSmall={true} /> : 'Salvar'}
							</Button>
						</div>
					</div>
				)}
			</OffCanvas>
		</section>
	);
};

DemissionTable.defaultProps = {
	isFluid: false,
};

export default DemissionTable;
