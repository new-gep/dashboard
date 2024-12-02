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
import Icon from '../../../components/icon/Icon';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks from '../../../components/bootstrap/forms/Checks';
import Popovers from '../../../components/bootstrap/Popovers';
import data from '../../../common/data/dummyEventsData';
import USERS from '../../../common/data/userDummyData';
import Mask from '../../../function/Mask';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';
import Job_Admissional from '../../../api/get/Job_Admissional';
import AuthContext from '../../../contexts/authContext';
import Job_One from '../../../api/get/Job_One';
import Job from '../../../api/patch/Job';
import { useNavigate } from 'react-router-dom';
interface ICommonUpcomingEventsProps {
	isFluid?: boolean;
}
const AdmissionTable: FC<ICommonUpcomingEventsProps> = ({ isFluid }) => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
    const [step, setStep]     = useState(1)
    const [stepTitle, setStepTitle] = useState('Exame admisisional')
    const [stepIcon, setIcon] = useState('LooksOne')
    const { userData } = useContext(AuthContext);
	const [candidates, setCandidates] = useState<null | any>(null)
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [menu, setMenu] = useState<boolean>(false)
	const [hasUpdate, setHasUpdate] = useState<number>(1)
	const [manipulating, setManipulating] = useState<null | any>(null)
	const [titleManipulating, setTitleManipulating] = useState<null | any>(null)
	const [controllerBodyManipulating, setControllerBodyManipulating] = useState<null | any>(null)
	const [SpinnerManipulating, setSpinnerManipulating] = useState<Boolean>(false)
	

	// BEGIN :: Upcoming Events
	const [upcomingEventsInfoOffcanvas, setUpcomingEventsInfoOffcanvas] = useState(false);
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false);

	// END :: Upcoming Events

	const formik = useFormik({
		onSubmit<Values>(
			values: Values,
			formikHelpers: FormikHelpers<Values>,
		): void | Promise<any> {
			return undefined;
		},
		initialValues: {
			customerName: 'Alison Berry',
			service: 'Exercise Bike',
			employee: `${USERS.GRACE.name} ${USERS.GRACE.surname}`,
			location: 'Maryland',
			date: dayjs().add(1, 'days').format('YYYY-MM-DD'),
			time: '10:30',
			note: '',
			notify: true,
		},
	});

    const navegationStep = async (navigation:boolean) => {
        let newStep
        if(navigation){
            setStep(step + 1)
            newStep = step + 1
        }else{
            setStep(step - 1)
            newStep = step - 1
        }
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
    }


	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['5']);
	const { items, requestSort, getClassNamesFor } = useSortableData(data);

	const handleUpcomingDetails = (note:any) => {
		formik.setFieldValue("note", note)
		setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
	};

	const handleUpcomingEdit = () => {
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
	};

	const toggleMenu = (e:any, colaborator:any) => {
		e.preventDefault(); 
		if(menu){
			setMenu(false)
		}
		setMenuPosition({ x: e.clientX, y: e.clientY });
		setMenu(true)
		setManipulating(colaborator)
	};

	const formSubmitController = async (action:string) => {
		switch (action) {
			case 'observation':
				setSpinnerManipulating(true)
				const response = await Job_One(manipulating.id)
				if(response.status == 200){
					let candidates = response.job.candidates
					//@ts-ignore
					candidates.forEach(item => {
						delete item.picture;
						delete item.name;
					});
					const candidate = candidates.find((item: { cpf: string | undefined; }) => item.cpf === manipulating.cpf);
					if (candidate) {
						candidate.observation = formik.values.note;
					}
					const params = {
						candidates:JSON.stringify(candidates)
					}
					const update = await Job(params, manipulating.id)
					if(update.status == 200 ){
						console.log('salvou')
						setSpinnerManipulating(false)
						setHasUpdate(prevState => prevState + 1);
					}else{
						console.log('não foi possível salvar a VAGA tabela (job)')
						setSpinnerManipulating(false)
					}
				}else{
					console.log('não foi possível encontrar a VAGA tabela (job)')
					setSpinnerManipulating(false)
			}
			break
			
		}
		setUpcomingEventsEditOffcanvas(false)
	};

	const closeMenu = () => {
		setMenu(false)
		setManipulating(null)
	};

	const menuController = (action:string) => {
		switch (action) {
			case 'nextStep':
				
				break;
			case 'previousStep':
				
				break;
			case 'profile':
				navigate(`/sales/Job/Customer/${manipulating.cpf}/${manipulating.id}`);
				break;
			case 'observation':
				setTitleManipulating('Adicione uma Observação');
				setControllerBodyManipulating('observation');
				handleUpcomingEdit();
				formik.setFieldValue("note", manipulating.observation)
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

	useEffect(()=>{
        const fetchData = async () => {
            const response = await Job_Admissional(userData.cnpj);
			if(response.status == 200){
				setCandidates(response.candidates)
				return
			}
        }
        if(userData && userData.cnpj){
            fetchData()
        }
    },[userData, hasUpdate])

	return (
		<section className='h-100'>
			{menu && (
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
						<Button
							icon='Check'
							color='dark'
							isLink={true}
							onClick={()=>menuController('nextStep')}
						>
							Avançar Etapa
						</Button>
					</li>
					{ step !== 1 &&
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
			

			<Card stretch={isFluid} onClick={closeMenu}>
				<CardHeader borderSize={1}>
					<CardLabel icon='InsertChart' iconColor='info'>
						<CardTitle tag='div' className='h5'>
							Processo de Admissão
						</CardTitle>
					</CardLabel>
					{ candidates &&
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
					{ candidates ?
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
								{dataPagination(candidates, currentPage, perPage).map((item) => (
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
													color={item.status ? 'success' : item.status == null ? 'warning' : 'danger'}
													icon='Circle'
													className='text-nowrap'>
													{item.status ? 'Aprovado' : item.status == null ? 'Em espera' : 'Reprovado'}
												</Button>
											</DropdownToggle>
										</td>
										<td>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames('text-nowrap', {
													'border-light': !darkModeStatus,
												})}
												icon='PhotoLibrary'
												onClick={handleUpcomingEdit}>
												Visualizar
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					:
						<div>
							<h2 className='fw-bold'>Nenhuma admissão em andamento</h2>
						</div>
					}
				</CardBody>
				<PaginationButtons
					data={items}
					label='items'
					setCurrentPage={setCurrentPage}
					currentPage={currentPage}
					perPage={perPage}
					setPerPage={setPerPage}
				/>
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
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>
						{titleManipulating}
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						{/* <div className='col-6'>
							<FormGroup id='date' label='Date'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.date}
									type='date'
								/>
							</FormGroup>
						</div> */}
						{ manipulating &&
							<div className='col-12'>
							<Card isCompact borderSize={2} shadow='none' className='mb-0'>
								<CardHeader>
									<CardLabel>
										<CardTitle>Observação</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody >
									<FormGroup id='note' label={manipulating.name}>
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
			</OffCanvas>
		</section>
	);
};
AdmissionTable.defaultProps = {
	isFluid: false,
};

export default AdmissionTable;
