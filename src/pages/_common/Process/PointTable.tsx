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

const PointTable = () => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const { userData } = useContext(AuthContext);
	const [data, setData] = useState<any[]>([]); // Dados fictícios
	const [menu, setMenu] = useState<boolean>(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [manipulating, setManipulating] = useState<null | any>(null);
	const navigate = useNavigate();

	const handleImport = () => {
		// Lógica para importar dados
		console.log('Importar dados');
	};

	const handleExport = () => {
		// Lógica para exportar dados
		console.log('Exportar dados');
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

	const menuController = async (action: string) => {
		switch (action) {
			case 'profile':
				navigate(`/collaborator/profile/${manipulating.CPF_collaborator}`);
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

	useEffect(() => {
		const fetchData = async () => {
			if (userData) {
				try {
					const response = await JobCollaboratorCompany(userData.cnpj);
					setData(response.collaborator);
                    console.log('response aqui',response)
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
					<CardLabel icon='AccessAlarms' iconColor='primary'>
						<CardTitle tag='div' className='h5'>
							Processo de Ponto
						</CardTitle>
					</CardLabel>
					<CardActions>
						<Button
							color='info'
							icon='CloudUpload'
							isLight
							tag='a'
							to='/somefile.txt'
							target='_blank'
							download>
							Importar
						</Button>
					</CardActions>
				</CardHeader>

				<CardBody>
					<table className='table table-modern'>
						<thead>
							<tr>
								<td aria-labelledby='Image' style={{ width: 60 }} />
								<th>Contato</th>
								<th>Nome</th>
								<th>Contrato</th>
								<th>Status</th>
								<td aria-labelledby='Actions' />
							</tr>
						</thead>
						<tbody>
							{data && data.length > 0 ? (
								data.map((item, index) => (
									<tr key={index}>
										<td>
											<Button
												isOutline={!darkModeStatus}
												color='dark'
												isLight={darkModeStatus}
												className={classNames({
													'border-light': !darkModeStatus,
												})}
												icon='Info'
												aria-label='Detailed information'
											/>
										</td>
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
										<td><p className='text-nowrap text-uppercase'>{item.collaborator && item.job.contract}</p></td>
										<td>
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
													// actionController(item);
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
		</section>
	);
};

export default PointTable;
