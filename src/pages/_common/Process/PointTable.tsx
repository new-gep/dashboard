import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardHeader,
	CardTitle,
	CardLabel,
	CardActions,
	CardBody,
} from '../../../components/bootstrap/Card';
import AuthContext from '../../../contexts/authContext';
import useDarkMode from '../../../hooks/useDarkMode';
import { DropdownToggle } from '../../../components/bootstrap/Dropdown';
import Mask from '../../../function/Mask';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasTitle,
	OffCanvasHeader,
} from '../../../components/bootstrap/OffCanvas';
import Toasts from '../../../components/bootstrap/Toasts';

import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Service_Upload from '../../../api/post/company/Service_Upload';
import Input from '../../../components/bootstrap/forms/Input';
import Company_Redis from '../../../api/post/company/Redis';
import Icon from '../../../components/icon/Icon';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';

import FindAllByMonthAndYear from '../../../api/get/service/FindAll';
import { priceFormat } from '../../../helpers/helpers';
import ServiceSignedDocument from '../../../components/canva/signatures/Service';

const PointTable = ({
	selectedMonth,
}: {
	selectedMonth: { monthEN: string; month: string; year: number };
}) => {
	const { themeStatus, darkModeStatus } = useDarkMode();
	const { userData } = useContext(AuthContext);
	const [data, setData] = useState<any[]>([]); // Dados fictícios
	const [dataIndex, setDataIndex] = useState<number>(0);
	const [menu, setMenu] = useState<boolean>(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	// Manipulating
	const [manipulating, setManipulating] = useState<null | any>(null);
	const [manipulatingDocument, setManipulatingDocument] = useState<string>('');
	const [manipulatingPath, setManipulatingPath] = useState<string>('');
	const [manipulatingMenu, setManipulatingMenu] = useState<null | any>(null);
	const [manipulatingIndex, setManipulatingIndex] = useState<number>(0);
	const [manipulatingKey, setManipulatingKey] = useState<string>('');
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState<boolean>(false);
	// Modals
	const [modalSelectPoint, setModalSelectPoint] = useState<boolean>(false);
	const [modalImport, setModalImport] = useState<boolean>(false);
	const [modalDocument, setModalDocument] = useState<boolean>(false);
	const [modalAction, setModalAction] = useState<string>('');
	const [modalSignedDocument, setModalSignedDocument] = useState<boolean>(false);
	// Signature
	const [allDocument, setAllDocument] = useState<any>();
	const [allSignature, setAllSignature] = useState<any>();

	const [selectedMonthImport, setSelectedMonthImport] = useState<{
		monthEN: string;
		month: string;
		year: number;
	}>({ monthEN: '', month: '', year: 0 });
	const [cache, setCache] = useState<any>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleImport = async (file: File) => {
		toast(
			<Toasts icon='Check' iconColor='success' title='Sucesso!'>
				Processamento iniciado com sucesso, o relatório será enviado para o seu e-mail.
				<br />
				<span className='font-weight-bold text-success'>{userData.email}</span>
			</Toasts>,
			{
				closeButton: true,
				autoClose: 1000, //
			},
		);
		setCache(true);
		setModalImport(false);
		const response = await Service_Upload({
			cnpj: userData.cnpj,
			file,
			user: userData.id,
			type: 'Point',
			mothAndYear: selectedMonthImport.month,
		});
		if (response && response.status == 200) {
			toast(
				<Toasts icon='Check' iconColor='success' title='Sucesso!'>
					Processamento realizado com sucesso, o relatório será enviado para o seu e-mail.
					<br />
					<span className='font-weight-bold text-success'>{userData.email}</span>
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000, //
				},
			);
		} else {
			setTimeout(() => {
				toast(
					<Toasts icon='Close' iconColor='danger' title='Erro!'>
						Erro ao processar o relatório, verifique se o arquivo está correto.
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000, //
					},
				);
			}, 5000);
		}
		setCache(false);
	};

	const openInputFile = async () => {
		if (selectedMonthImport.month == '') {
			toast(
				<Toasts icon='Close' iconColor='danger' title='Erro!'>
					Selecione o mês e ano para importar o ponto.
				</Toasts>,
			);
			return;
		}
		document.getElementById('fileInput')?.click();
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
		setManipulating(item);
		setUpcomingEventsEditOffcanvas(true);
	};

	const ViewDocument = () => {
		if (manipulating?.service?.length === 1) {
			// Se houver apenas um ponto, abrir diretamente o modal do documento
			const item = manipulating.service[0];
			const key = Object.keys(item)[0];
			const pictureData = item[key].pictureService;

			setManipulatingPath(pictureData.path);
			setModalDocument(true);
		} else {
			// Se houver mais de um ponto, abre o modal de seleção
			setModalSelectPoint(true);
		}
		setModalAction('viewDocument');
	};

	const ViewSignature = () => {
		if (manipulating?.signature?.picture) {
			setManipulatingPath(manipulating.signature.picture.path);
			setModalAction('viewSignatureDocument');
			setModalDocument(true);
			return;
		}
		toast(
			<Toasts icon='Close' iconColor='danger' title='Erro!'>
				O colaborador não enviou a assinatura.
			</Toasts>,
		);
	};

	const ViewSignedDocument = () => {
		setModalAction('viewDocumentFull');
		setModalSelectPoint(true);
	};

	const buildDocumentSignature = (item: any) => {
		setModalAction('buildSignatureDocument');
		setModalSelectPoint(true);
	};

	const closeAfterSaveDocumentSignature = () => {};

	// Rotacionar o icone de loading
	useEffect(() => {
		const style = document.createElement('style');
		style.innerHTML = `
		  @keyframes spin {
			from { transform: rotate(360deg); }
			to { transform: rotate(0deg); }
		  }
		`;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	// Buscar dados
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (userData) {
				console.log('selectedMonth', selectedMonth);
				const response = await FindAllByMonthAndYear(
					'Point',
					userData.cnpj,
					selectedMonth.monthEN,
					selectedMonth.year.toString(),
				);
				console.log('response xd', response);
				if (response && response.status == 200) {
					console.log('response', response.collaborators);
					setData(response.collaborators);
				} else {
					setData([]);
				}
				setLoading(false);
			}
		};
		fetchData();
	}, [selectedMonth]);

	// Buscar dados
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (userData) {
				try {
					const cache = await Company_Redis({
						action: 'get',
						key: `Company_${userData.cnpj}_Import_Service`,
					});
					if (cache.status == 200) {
						setCache(cache.data);
					}

					const response = await FindAllByMonthAndYear(
						'Point',
						userData.cnpj,
						'January',
						'2025',
					);
					if (response && response.status == 200) {
						console.log('response', response.collaborators);
						setData(response.collaborators);
					}
				} catch (error) {
					console.error('Erro ao buscar dados:', error);
				}
			}
		};
		fetchData();
	}, [userData]);

	return (
		<section>
			{manipulating && (
				<ServiceSignedDocument
					type='Point'
					closeAfterSave={closeAfterSaveDocumentSignature}
					nameDocument={manipulatingDocument}
					data={data}
					setData={setData}
					dataIndex={dataIndex}
					manipulatingKey={manipulatingKey}
					manipulatingIndex={manipulatingIndex}
					id={manipulating.job.id_work}
					modal={modalSignedDocument}
					setModal={setModalSignedDocument}
					document={allDocument}
					assignature={allSignature}
				/>
			)}

			<Modal isStaticBackdrop isOpen={modalImport} setIsOpen={setModalImport} size='sm'>
				<ModalHeader>
					<ModalTitle
						className='d-flex justify-content-end align-items-start gap-2'
						id='import-modal'>
						<div className='d-flex flex-column justify-content-end'>
							<h1 className='h4 font-weight-bold'>Importar</h1>
							<p className='text-muted small'>
								Selecione o mês e ano para importar o ponto.
							</p>
						</div>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<FormGroup label='Selecione o mês e ano'>
						<Input
							className='text-capitalize'
							placeholder='Selecione o mês e ano'
							type='month'
							value={selectedMonthImport.month}
							onChange={(e: any) =>
								setSelectedMonthImport({
									...selectedMonthImport,
									month: e.target.value,
								})
							}
						/>
					</FormGroup>
				</ModalBody>
				<ModalFooter className='d-flex justify-content-end gap-2'>
					<Button color='info' isLink onClick={() => setModalImport(false)}>
						Cancelar
					</Button>
					<Button
						color='success'
						icon='CloudUpload'
						isLight
						onClick={async () => {
							openInputFile();
						}}>
						Importar
					</Button>
				</ModalFooter>
			</Modal>

			<Modal
				isOpen={modalSelectPoint}
				setIsOpen={setModalSelectPoint}
				size='sm'
				isStaticBackdrop>
				<ModalHeader setIsOpen={setModalSelectPoint}>
					<ModalTitle id='signature-modal'>Selecione o Ponto</ModalTitle>
				</ModalHeader>

				<ModalBody>
					{manipulating &&
						manipulating.service &&
						manipulating.service.length > 0 &&
						manipulating.service.map((item: any, index: number) => {
							const key = Object.keys(item)[0]; // Pega a chave dinâmica
							const serviceData = item[key].item; // Acessa o conteúdo do objeto
							const pictureData = item[key].pictureService;
							const pictureFullData = item[key].pictureFull;
							const signatureData = manipulating.signature.picture;

							return (
								<div key={index} className='d-flex flex-column gap-2 '>
									<div>
										<Button
											color='primary'
											isLink
											onClick={() => {
												// console.log('pictureData', pictureData);
												if (modalAction == 'viewDocument') {
													setManipulatingPath(pictureData.path);
													setModalSelectPoint(false);
													setModalDocument(true);
												} else if (modalAction == 'viewDocumentFull') {
													if (pictureFullData && pictureFullData.path) {
														setManipulatingPath(pictureFullData.path);
														setModalDocument(true);
													} else {
														toast(
															<Toasts
																icon='Close'
																iconColor='danger'
																title='Erro!'>
																Documento completo não encontrado.
															</Toasts>,
														);
													}
												} else if (modalAction == 'viewSignatureDocument') {
												} else if (
													modalAction == 'buildSignatureDocument'
												) {
													setAllDocument(pictureData);
													setAllSignature(signatureData);
													setManipulatingIndex(index);
													setManipulatingKey(key);
													setManipulatingDocument(serviceData.name);
													if (signatureData && pictureData) {
														setModalSignedDocument(true);
													} else {
														toast(
															<Toasts
																icon='Close'
																iconColor='danger'
																title='Erro!'>
																Assinatura não encontrada.
															</Toasts>,
														);
													}
												} else {
													console.log('modalAction:', modalAction);
												}
											}}>
											Ponto {index}
										</Button>
									</div>
								</div>
							);
						})}
				</ModalBody>

				<ModalFooter>
					<p className='text-muted'>
						{selectedMonth.month} {selectedMonth.year}
					</p>
				</ModalFooter>
			</Modal>

			<Modal isStaticBackdrop isOpen={modalDocument} setIsOpen={setModalDocument} size='lg'>
				<ModalHeader>
					<div>
						<h1 className='mb-0 p-0'>Documento</h1>
						<p className='mt-0 p-0'>Avalie o documento</p>
						{manipulating && <span className='text-warning'>{manipulating.name}</span>}
					</div>
				</ModalHeader>

				<ModalBody>
					<iframe
						title='Conteúdo incorporado da página'
						src={manipulatingPath}
						className='rounded-md left-5'
						style={{ height: '500px', width: '100%', borderRadius: '10px' }}
					/>
				</ModalBody>

				<ModalFooter className='d-flex justify-content-between'>
					<div>
						<Button
							isLink
							color='light'
							icon={
								modalAction == 'viewDocument' || modalAction == 'viewDocumentFull'
									? 'ArrowBack'
									: 'Close'
							}
							onClick={() => {
								if (
									modalAction == 'viewDocument' ||
									modalAction == 'viewDocumentFull'
								) {
									setModalDocument(false);
									setModalSelectPoint(true);
								} else {
									setModalDocument(false);
								}
							}}>
							{modalAction == 'viewDocument' || modalAction == 'viewDocumentFull'
								? 'Voltar'
								: 'Fechar'}
						</Button>
					</div>
					{modalAction !== 'viewDocument' && modalAction !== 'viewDocumentFull' && (
						<div className='d-flex gap-4'>
							<Button isLight color='danger' onClick={() => {}}>
								Recusar
							</Button>
							<Button isLight color='success' onClick={() => {}}>
								Aprovar
							</Button>
						</div>
					)}
				</ModalFooter>
			</Modal>

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
							isLink
							onClick={() => menuController('profile')}>
							Perfil
						</Button>
					</li>
					<li>
						<Button
							icon='Markunread'
							color='dark'
							isLink
							onClick={() => menuController('email')}>
							Enviar e-mail
						</Button>
					</li>
					<li>
						<Button
							icon='Textsms'
							color='dark'
							isLink
							onClick={() => menuController('whatsapp')}>
							Conversar no Whatsapp
						</Button>
					</li>
				</ul>
			)}

			<Card stretch>
				<CardHeader borderSize={1}>
					<CardLabel icon='AccessAlarm' iconColor='primary'>
						<CardTitle tag='div' className='h5'>
							Processo de Ponto
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
										<Toasts icon='Close' iconColor='danger' title='Erro!'>
											Envie apenas <span>PDF</span>, não aceitamos outros
											tipos de documentos.
										</Toasts>,
										{
											closeButton: true,
											autoClose: 1000, //
										},
									);
								}
							}}
						/>
						{cache ? (
							<Button
								className='d-flex align-items-center gap-2'
								color='warning'
								onClick={async () => {
									const verifyCache = await Company_Redis({
										action: 'get',
										key: `Company_${userData.cnpj}_Import_Service`,
									});
									if (verifyCache && verifyCache.status == 200) {
										toast(
											<Toasts
												icon='Warning'
												iconColor='warning'
												title='Atenção!'>
												Estamos processando os dados, aguarde alguns
												instantes.
											</Toasts>,
											{
												closeButton: true,
												autoClose: 1000, //
											},
										);
									} else {
										toast(
											<Toasts
												icon='Check'
												iconColor='success'
												title='Sucesso!'>
												Processamento realizado com sucesso, o relatório
												será enviado para o seu e-mail.
												<br />
												<span className='font-weight-bold text-success'>
													{userData.email}
												</span>
											</Toasts>,
											{
												closeButton: true,
												autoClose: 1000, //
											},
										);
										setCache(false);
									}
								}}>
								<Icon
									icon='Sync'
									size='lg'
									style={{ animation: 'spin 1s linear infinite' }}
								/>
								Processando
							</Button>
						) : (
							<Button
								color='info'
								icon='CloudUpload'
								isLight
								target='_blank'
								onClick={async () => {
									// const verifyCache = await Company_Redis({
									// 	action: 'get',
									// 	key: `Company_${userData.cnpj}_Import_Service`,
									// });

									// if(verifyCache && verifyCache.status == 200){
									// 	setCache(true);
									// 	toast(
									// 		<Toasts icon={'Warning'} iconColor={'warning'} title={'Atenção!'}>
									// 			Processamento já iniciado, aguarde alguns instantes.
									// 		</Toasts>,
									// 		{
									// 			closeButton: true,
									// 			autoClose: 1000, //
									// 		}
									// 	);
									// 	return;
									// };

									setModalImport(true);
								}}>
								Importar
							</Button>
						)}
					</CardActions>
				</CardHeader>

				<CardBody className='table-responsive' onClick={closeMenu}>
					{loading ? (
						<div className='d-flex flex-column  gap-2'>
							{/* <Spinner/> */}
							<h1>🔍 Buscando Pontos</h1>
							{/* <p className='text-muted text-capitalize' >{selectedMonth.month} {selectedMonth.year}</p> */}
						</div>
					) : data && data.length > 0 ? (
						<table className='table table-modern'>
							<thead>
								<tr>
									<th>Contato</th>
									<th>Nome</th>
									<th>Contrato</th>
									<th>Função</th>
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
											<td>
												<div>
													<div className='text-capitalize'>
														{item.job.function}
													</div>
													<div className='small text-muted'>
														R$ {priceFormat(item.job.salary)}
													</div>
												</div>
											</td>
											<td className='text-center'>
												<DropdownToggle hasIcon={false}>
													<Button
														isLink
														color={
															item.signature && item.signature
																? item.signature.service.status.toLowerCase() ==
																	'approved'
																	? 'success'
																	: item.signature.service.status.toLowerCase() ==
																		  'rejected'
																		? 'danger'
																		: 'warning'
																: 'light'
														}
														icon='Circle'
														className='text-nowrap'>
														{item.signature && item.signature
															? item.signature.service.status.toLowerCase() ==
																'approved'
																? 'Aprovado'
																: item.signature.service.status.toLowerCase() ==
																	  'rejected'
																	? 'Rejeitado'
																	: 'Em espera'
															: 'Assinatura pendente'}
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
													icon='PhotoLibrary'
													onClick={() => {
														handleOpenOffcanvas(item);
														setDataIndex(index);
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
					) : (
						<div className='d-flex flex-column  gap-2'>
							<h1>Nenhum ponto encontrado</h1>
							<p className='text-muted text-capitalize'>
								{selectedMonth.month} {selectedMonth.year}
							</p>
						</div>
					)}
				</CardBody>
			</Card>

			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				isBackdrop={false}
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
									isLink
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
									isLink
									icon='Mode'
									color='storybook'
									onClick={() => {
										ViewSignature();
									}}>
									Assinatura
								</Button>
							</div>
							<div>
								<Button
									isLink
									icon='Verified'
									color='warning'
									onClick={() => {
										ViewSignedDocument();
									}}>
									Documento Assinado
								</Button>
							</div>
						</FormGroup>

						<FormGroup label='Gerar'>
							<div>
								<Button
									isLink
									icon='LibraryAdd'
									color='success'
									onClick={buildDocumentSignature}>
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

export default PointTable;
