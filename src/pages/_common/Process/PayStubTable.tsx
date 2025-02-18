import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../components/bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Card, {
	CardHeader,
	CardTitle,
	CardLabel,
	CardActions,
	CardBody,
} from '../../../components/bootstrap/Card';
import JobCollaboratorCompany from '../../../api/get/job/Job_Collaborator_Company';
import AuthContext from '../../../contexts/authContext';
import classNames from 'classnames';
import useDarkMode from '../../../hooks/useDarkMode';
import { DropdownToggle } from '../../../components/bootstrap/Dropdown';
import Mask from '../../../function/Mask';
import {
	OffCanvasBody,
	OffCanvasTitle,
	OffCanvasHeader,
} from '../../../components/bootstrap/OffCanvas';
import { toast } from 'react-toastify';
import Toasts from '../../../components/bootstrap/Toasts';
import OffCanvas from '../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Service_Upload from '../../../api/post/company/Service_Upload';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Input from '../../../components/bootstrap/forms/Input';

const PayStubTable = ({
	selectedMonth,
}: {
	selectedMonth: { monthEN: string; month: string; year: number };
}) => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const { userData } = useContext(AuthContext);
	const [data, setData] = useState<any[]>([]); // Dados fictícios
	const [menu, setMenu] = useState<boolean>(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [manipulating, setManipulating] = useState<null | any>(null);
	const [manipulatingMenu, setManipulatingMenu] = useState<null | any>(null);
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleImport = async (file: File) => {
		// Lógica para importar dados
		const response = await Service_Upload({
			file: file,
			user: userData.id,
			type: 'paystub',
		});

	};

	const handleExport = () => {
		// Lógica para exportar dados
		console.log('Exportar dados');
	};

	const toggleMenu = (e: any, colaborator: any) => {
		setManipulatingMenu(colaborator);
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
		setManipulatingMenu(null);
	};

	const menuController = async (action: string) => {
		switch (action) {
			case 'profile':
				navigate(`/collaborator/profile/${manipulatingMenu.collaborator.CPF}`);
				break;
			case 'email':
				const encodedSubject = encodeURIComponent('Assunto');
				const encodedBody = encodeURIComponent('Digite seu texto');
				const mailtoURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${manipulatingMenu.collaborator.email}&su=${encodedSubject}&body=${encodedBody}`;

				window.open(mailtoURL, '_blank');
				break;
			case 'whatsapp':
				const whatsappURL = `https://wa.me/55${manipulatingMenu.collaborator.phone}`;
				window.open(whatsappURL, '_blank');
				break;
		}
		setMenu(false);
	};

	const handleOpenOffcanvas = (item: any) => {
		console.log('item aquxxi', item);
		setManipulating(item);
		setUpcomingEventsEditOffcanvas(true);
	};

	const ViewDocument = () => {
		console.log('item aqui', manipulating);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (userData) {
				try {
					const response = await JobCollaboratorCompany(userData.cnpj);
					setData(response.collaborator);
					console.log('response aqui', response);
				} catch (error) {
					console.error('Erro ao buscar dados:', error);
				}
			}
		};
		fetchData();
	}, [userData]);

	return (
		<section>
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
			<Card stretch={true}>
				<CardHeader borderSize={1}>
					<CardLabel icon='AttachMoney' iconColor='success'>
						<CardTitle tag='div' className='h5'>
							Processo de Holerite
						</CardTitle>
					</CardLabel>
					<CardActions>
						<input
							className='d-none'
							type='file'
							id='fileInput'
							onChange={(e: any) => {
								const file = e.target.files[0];
								if (file && file.type === 'application/pdf') {
									handleImport(file);
								} else {
									toast(
										<Toasts icon={'Close'} iconColor={'danger'} title={'Erro!'}>
											Envie apenas <span>PDF</span>, não aceitamos outros
											tipos de documentos.
										</Toasts>,
										{
											closeButton: true,
											autoClose: 5000, //
										},
									);
									return;
								}
							}}
						/>
						<Button
							color='info'
							icon='CloudUpload'
							isLight
							target='_blank'
							onClick={() => document.getElementById('fileInput')?.click()}>
							Importar
						</Button>
					</CardActions>
				</CardHeader>

				<CardBody className='table-responsive' onClick={closeMenu}>
					<table className='table table-modern'>
						<thead>
							<tr>
								<th>Contato</th>
								<th>Nome</th>
								<th>Contrato</th>
								<th className='text-center'>Status</th>
								<td aria-labelledby='Actions' />
							</tr>
						</thead>
						<tbody>
							{data && data.length > 0 ? (
								data.map((item, index) => (
									<tr key={index} onContextMenu={(e) => toggleMenu(e, item)}>
										<td>
											<div>
												<div>{Mask('phone', item.collaborator.phone)}</div>
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
														src={item.picture}
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
										<td>
											<p className='text-nowrap text-uppercase'>
												{item.collaborator && item.job.contract}
											</p>
										</td>
										<td className='text-center'>
											<DropdownToggle hasIcon={false}>
												<Button
													isLink
													color={
														item.status && item.verify
															? 'success'
															: item.status == null &&
																  item.verify == null
																? 'warning'
																: item.status == false &&
																	  item.verify == null
																	? 'light'
																	: 'danger'
													}
													icon='Circle'
													className='text-nowrap'>
													{item.status && item.verify
														? 'Aprovado'
														: item.status == null && item.verify == null
															? 'Em espera'
															: item.status == false &&
																  item.verify == null
																? 'Rejeitado'
																: 'Reprovado'}
												</Button>
											</DropdownToggle>
										</td>
										<td>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames('text-nowrap col-12 ', {
													'border-light': !darkModeStatus,
												})}
												icon={'PhotoLibrary'}
												onClick={() => {
													handleOpenOffcanvas(item);
												}}>
												Buscar
											</Button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4} className='text-center'>
										Nenhum dado disponível
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</CardBody>
			</Card>

			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				isBackdrop={manipulating ? true : false}
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle className='text-capitalize' id='upcomingEdit'>
						{selectedMonth.month} {selectedMonth.year}
						<p className='text-muted'>
							{manipulating && manipulating.collaborator.name}
						</p>
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-3'>
						<div className='col-12 items-center d-flex justify-content-center'>
							<img
								className='rounded-circle'
								src={manipulating && manipulating.picture}
								width={100}
								height={100}
								// srcSet={item.assigned.srcSet}
								// color={item.assigned.color}
							/>
						</div>
						<p className='px-3'>
							Abaixo, visualize os arquivos enviados para o colaborador e assinaturas
						</p>

						<FormGroup label='Visualizar' className='gap-2 d-flex flex-column'>
							<div>
								<Button
									isLink={true}
									icon='Description'
									color='info'
									onClick={() => {
										ViewDocument();
									}}>
									Documento
								</Button>
							</div>
							<div>
								<Button
									isLink={true}
									icon='Mode'
									color='storybook'
									onClick={() => {}}>
									Assinatura
								</Button>
							</div>
							<div>
								<Button
									isLink={true}
									icon='Verified'
									color='warning'
									onClick={() => {}}>
									Documento Assinado
								</Button>
							</div>
						</FormGroup>

						<FormGroup label='Gerar'>
							<div>
								<Button
									isLink={true}
									icon='LibraryAdd'
									color='success'
									onClick={() => {}}>
									Documento Assinado
								</Button>
							</div>
						</FormGroup>
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button color='info' className='w-100' onClick={() => {}}>
							Salvar
						</Button>
					</div>
				</div>
			</OffCanvas>
		</section>
	);
};

export default PayStubTable;
