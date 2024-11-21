import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import { demoPagesMenu } from '../../../menu';
import data from '../../../common/data/dummyCustomerData';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/icon/Icon';
import { priceFormat } from '../../../helpers/helpers';
import latestSalesData from '../../../common/data/dummySalesData';
import useSortableData from '../../../hooks/useSortableData';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import CustomerEditModal from '../crm/CustomerEditModal';
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import Collaborator from '../../../api/get/Collaborator';
import Mask from '../../../function/Mask';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../components/bootstrap/Modal';
import CollaboratorFile from '../../../api/get/CollaboratorFile';
import PDFViewer from 'pdf-viewer-reactjs'
const Customer = () => {
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const { cpf } = useParams();
	const { jobId } = useParams();

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['3']);
	const { items, requestSort, getClassNamesFor } = useSortableData(latestSalesData);
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false);
	const [collaborator, setCollaborator] = useState<any>(null);
	const [picture, setPicture]  = useState<any>(null);
	const [openDocument, setOpenDocument]  = useState<boolean>(false);
	const [typeDocument, setTypeDocument] = useState<any>(null);
	const [pathDocument, setPathDocument] = useState<any>(null);


	const goBack = () => {
		navigate(-1);  // Volta à página anterior
	};

	const ViewDoc = async (document:string) => {
		let response:any;
		switch (document) {
			case 'rg':
				response = await CollaboratorFile(cpf, 'rg');
				break;
			case 'cnh':
				response = await CollaboratorFile(cpf, 'cnh');
				console.log('cnh: ',response)
				break;
			case 'vote':
				response = await CollaboratorFile(cpf, 'voter_registration');
				console.log('titulo de eleitor: ',response)
				break;
			case 'work':
				response = await CollaboratorFile(cpf, 'work_card');
				console.log('carteira de trabalho',response)
				break;
			case 'school':
				response = await CollaboratorFile(cpf, 'school_history');
				console.log('escola: ',response)
				break;
			case 'address':
				response = await CollaboratorFile(cpf, 'address');
				console.log('endreço: ',response)
				break;
			case 'children':
				console.log('children')
				break;
			case 'marriage':
				response = await CollaboratorFile(cpf, 'marriage_certificate');
				console.log('casamento:', response)
				break;
			case 'miltiar':
				response = await CollaboratorFile(cpf, 'military_certificate');
				console.log('militar: ',response)
				break;
			default:
				console.log('desconhecido')
				break;
		};
		setTypeDocument(response.type)
		console.log(response)
		if(response.type == 'pdf'){
			setPathDocument(response.path)
		}else{
			setPathDocument(response.path)
		}
		setOpenDocument(true)
	};

	useEffect(()=>{
		const fetchData = async () => {
			//@ts-ignore
			const response = await Collaborator(cpf)
			setCollaborator(response.collaborator)
			setPicture(response.picture)
		}
		fetchData()
	},[])

	return (
		<PageWrapper title={demoPagesMenu.crm.subMenu.customer.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='primary'
						isLink
						icon='ArrowBack'
						tag='a'
						onClick={goBack}>
						Voltar
					</Button>
				</SubHeaderLeft>
			</SubHeader>
			<Modal isOpen={openDocument} setIsOpen={setOpenDocument}>
				<ModalHeader>
					<p>teste</p>
				</ModalHeader>
				<ModalBody>
					{ typeDocument &&
						<iframe
						   title="Conteúdo incorporado da página"
						   src={pathDocument}
						   className="rounded-md left-5"
						   style={{ height: "500px", width: "500px" }}
						 />
					}
				</ModalBody>
				<ModalFooter className={ `` }>
					<p>footer</p>
				</ModalFooter>
			</Modal>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>{collaborator && collaborator.name}</span>
					{/* <span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{item.type}
					</span> */}
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12 d-flex justify-content-center'>
										<img
											className='rounded-circle'
											src={`${picture}`}
											width={125}
											height={125}
										/>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Mail'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{collaborator && collaborator.email}
														</div>
														<div className='text-muted'>
															Email
														</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='PhoneAndroid'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{collaborator && Mask('phone',collaborator.phone)}
														</div>
														<div className='text-muted'>
															Celular
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<div>
								<CardHeader className="d-block">
									<CardLabel icon='Tungsten'>
										<CardTitle tag='div' className='h5'>
											Informações
										</CardTitle>
									</CardLabel>
									{ collaborator && collaborator.update_at &&
										<CardActions>
											atualizado às {collaborator && Mask('lastUpdate',collaborator.update_at)}.
										</CardActions>
									}
								</CardHeader>
							</div>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-warning rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Cake' size='3x' color='warning' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>{collaborator && Mask('birth',collaborator.birth)}</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													{collaborator && Mask('date',collaborator.birth)}
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-info rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='VolunteerActivism' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{collaborator && collaborator.marriage == 1 ? 'Sim' : 'Não'}
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Casado(a)
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-primary rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='ChildCare' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>{collaborator && Object.keys( collaborator.children).length}</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Filhos
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-success rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Transgender' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>{collaborator && collaborator.sex}</div>
												<div className='text-muted mt-n2'>Sexo Biológico</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>
						<Card>
							<CardHeader>
								<CardLabel icon='PhotoLibrary'>
									<CardTitle tag='div' className='h5'>
										Documentos
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='row gap-3'>
								<div className='row'>
									<div className='col-xl-2'>
										<Button
											onClick={()=>ViewDoc('rg')}
											className={`d-flex align-items-center col-12 bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon='QueryBuilder' size='3x' color='warning' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>RG</div>
												</div>
											</div>
										</Button>
									</div>
									<div className={`col-xl-4 ${collaborator && Object.keys( collaborator.children).length <= 0 && 'opacity-50'}`}>
										<Button
											onClick={()=>ViewDoc('cnh')}
											className={`d-flex col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon='QueryBuilder' size='3x' color='warning' />
												</div>
												<div className='ms-3'>
													<div className='fw-bold fs-3 mb-0'>
														CNH <span className='fs-6 ms-2'>(opcional)</span>
													</div>
												</div>
											</div>
										</Button>
									</div>
									<div className={`col-xl-6 ${collaborator && Object.keys( collaborator.children).length <= 0 && 'opacity-50'}`}>
										<Button
											onClick={()=>ViewDoc('voter')}
											className={`d-flex col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon='QueryBuilder' size='3x' color='warning' />
												</div>
													<div className='ms-3'>
													<div className='fw-bold fs-3 mb-0'>
														Título de Eleitor <span className='fs-6 ms-2'>(opcional)</span>
													</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row'>
									<div className='col-xl-6 '>
										<Button
											onClick={()=>ViewDoc('work')}
											className={`d-flex col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon='QueryBuilder' size='3x' color='warning' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>Carteira de Trabalho</div>
												</div>
											</div>
										</Button>
									</div>
									<div className='col-xl-6 '>
										<Button
											onClick={()=>ViewDoc('school')}
											className={`d-flex col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon='QueryBuilder' size='3x' color='warning' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>Histórico Escolar</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row'>
									<div className={`col-xl-8`}>
										<Button
											onClick={()=>ViewDoc('address')}
											className={`d-flex col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon={ 'QueryBuilder'} size='3x' color={`warning`} />
												</div>
												<div className={`flex-grow-1 ms-3 `}>
													<div className='fw-bold fs-3 mb-0'>Comprovante de Endereço</div>
												</div>
											</div>
										</Button>
									</div>
									<div className={`col-xl-4  ${collaborator && Object.keys( collaborator.children).length <= 0 && 'opacity-50'}`}
									>
										<Button
											onClick={()=>ViewDoc('children')}
											className={`d-flex align-items-center col-12 bg-l${
												darkModeStatus ? 'o25' : '10'
											}-warning rounded-2 p-3`}
											>
											<div className="d-flex align-items-center">
												{/* Ícone */}
												<div className="flex-shrink-0">
												<Icon icon="QueryBuilder" size="3x" color="warning" />
												</div>
												{/* Texto */}
												<div className="ms-3">
												<div className="fw-bold fs-3 mb-0">Filhos</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
								<div className='row'>
									<div className={`col-xl-7 ${ collaborator && collaborator.marriage !== '1' && 'opacity-50' }`}>
										<Button
											onClick={()=>ViewDoc('marriage')}
											className={`d-flex align-items-center col-12 bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon={`${ collaborator && collaborator.sex.toLowerCase() !== '1' ? 'Block' : 'QueryBuilder'} `} size='3x' color='warning' />
												</div>
												<div className='flex-grow-1 ms-3'>
													<div className='fw-bold fs-3 mb-0'>Certidão de Casamento</div>
												</div>
											</div>
										</Button>
									</div>

									<div className={`col-xl-5 ${ collaborator && collaborator.sex.toLowerCase() == 'f' && 'opacity-50' }`}>
										<Button
											onClick={()=>ViewDoc('miltiar')}
											className={`d-flex  col-12 align-items-center bg-l${
											darkModeStatus ? 'o25' : '10'
										}-warning rounded-2 p-3`}>
											<div className="d-flex align-items-center">
												<div className='flex-shrink-0'>
													<Icon icon={`${ collaborator && collaborator.sex.toLowerCase() == 'f' ? 'Block' : 'QueryBuilder'} `} size='3x' color={`warning`} />
												</div>
												<div className={`flex-grow-1 ms-3 `}>
													<div className='fw-bold fs-3 mb-0'>Certificado Militar</div>
												</div>
											</div>
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='MapsHomeWork'>
									<CardTitle tag='div' className='h5'>
										Endereço
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-md-12'>
										<div className='row'>
											<div className='col-6 fw-bold fs-4'>
												{collaborator && `${collaborator.street}, N° ${collaborator.number}`}
											</div>
											<div className='col-6 fw-bold fs-4'>
												{collaborator && collaborator.complement}
											</div>
										</div>
										<div className='row'>
											<div className='col-6 fs-4'>
												{collaborator && collaborator.district}
											</div>
											<div className='col-6 fs-4'>
												{collaborator && `${collaborator.city}, ${collaborator.uf}`}
											</div>
										</div>
										<div>CEP: {collaborator && collaborator.zip_code}</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
			<CustomerEditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={cpf || 'loading'}
			/>
		</PageWrapper>
	);
};

export default Customer;
