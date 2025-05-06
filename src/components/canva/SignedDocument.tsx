import { useContext, useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { toast } from 'react-toastify';
import Button from '../bootstrap/Button';
import Job_DocumentSignature from '../../api/post/Job_DocumentSignature';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../bootstrap/Modal';
import Toasts from '../bootstrap/Toasts';
import Spinner from '../bootstrap/Spinner';
import GetCompanyDocument from '../../api/get/company/Document';
import AuthContext from '../../contexts/authContext';
import CreateSignature from '../../api/post/signature/Default';

interface Props {
	step?: any;
	where?: string | null;
	document: any;
	nameDocument: string | null;
	assignature: any;
	dynamic: boolean;
	modal: boolean;
	setModal: any;
	id: number;
	closeAfterSave?: any;
}

export default function SignedDocument({
	modal,
	setModal,
	document,
	assignature,
	nameDocument,
	dynamic,
	id,
	closeAfterSave,
	where = null,
	step = null,
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sectionRef = useRef<HTMLCanvasElement>(null);
	const { userData } = useContext(AuthContext);
	const [canvas, setCanvas] = useState<any>(null);
	const [loader, setLoader] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const inputFile = useRef(null);
	const [pages, setPages] = useState<any[]>([]); // imagens em base64
	const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const [start, setStart] = useState(false);

	async function loadImage(base64: any): Promise<any> {
		try {
			const imagemFabric = await fabric.FabricImage.fromURL(base64, {
				crossOrigin: 'anonymous',
			});
			return imagemFabric;
		} catch (error) {
			console.error('Erro ao carregar a imagem:', error);
			throw error;
		}
	}

	async function saveImage() {
		if (!canvasRef.current) return;

		// Gera o base64 atual da página
		const dataURL = canvasRef.current.toDataURL('png', 100);

		// Cria uma cópia atualizada do array de páginas
		const updatedPages = [...pages];
		updatedPages[currentPageIndex] = {
			...updatedPages[currentPageIndex],
			base64: dataURL,
		};

		setLoader(true);
		let PropsCreateSignature;
		let PropsUploadJob;
		if (where) {
			PropsUploadJob = {
				name: dynamic
					? step == '1'
						? 'dismissal_communication_dynamic'
						: 'dismissal_dynamic'
					: nameDocument,
				idJob: id,
				dynamic: dynamic ? nameDocument : null,
				pages: updatedPages, // usa a versão atualizada aqui!
			};
			PropsCreateSignature = {
				id_job: id,
				id_user: userData.id,
				document: dynamic
					? step == '1'
						? 'dismissal_communication_dynamic'
						: 'dismissal_dynamic'
					: nameDocument,
			};
		} else {
			PropsUploadJob = {
				name: dynamic ? 'dynamic' : nameDocument,
				idJob: id,
				dynamic: dynamic ? nameDocument : null,
				pages: updatedPages, // usa a versão atualizada aqui!
			};
			PropsCreateSignature = {
				id_job: id,
				id_user: userData.id,
				document: nameDocument,
			};
		}

		const response = await Job_DocumentSignature(PropsUploadJob);
		if (response.status == 200) {
			const response = await CreateSignature(PropsCreateSignature);
			console.log(response);
			await closeAfterSave();
			setModal(false);
			toast(
				<Toasts icon='Check' iconColor='success' title='🥳 Parabéns! '>
					Sucesso ao gerar documento assinado.
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000,
				},
			);
			setLoader(false);
			return;
		}

		toast(
			<Toasts icon='Close' iconColor='danger' title='Erro! '>
				Erro ao gerar documento assinado.
			</Toasts>,
			{
				closeButton: true,
				autoClose: 1000,
			},
		);
		setLoader(false);
	}

	const findSignatureCompany = async () => {
		try {
			const response = await GetCompanyDocument(userData.cnpj, 'signature');
			if (response.status == 200) {
				const signature = await loadImage(response.path);
				signature.set({
					borderColor: 'black',
					cornerColor: 'black',
					cornerStrokeColor: 'black',
					cornerSize: 10,
				});
				signature.scaleToWidth(400);
				const canvasWidth = canvas.getWidth();
				const canvasHeight = canvas.getHeight();
				signature.left = (canvasWidth - signature.getScaledWidth()) / 2;
				signature.top = (canvasHeight - signature.getScaledHeight()) / 2;

				canvas.add(signature);
				canvas.renderAll();
				toast(
					<Toasts icon='Check' iconColor='success' title='Sucesso! '>
						Sucesso, encontramos sua assinatura!
					</Toasts>,
					{
						closeButton: true,
						autoClose: 1000,
					},
				);
				return;
			}
			toast(
				<Toasts icon='Close' iconColor='danger' title='Erro! '>
					Erro, não encontramos sua assinatura!
				</Toasts>,
				{
					closeButton: true,
					autoClose: 1000,
				},
			);
		} catch (e) {
			console.log(e);
			console.log('erro inesperado');
		}
	};

	const findSignatureCollaborator = async () => {
		const signature = await loadImage(assignature.path);

		signature.set({
			borderColor: 'black',
			cornerColor: 'black',
			cornerStrokeColor: 'black',
			cornerSize: 10,
		});

		signature.scaleToWidth(200); // <- Primeiro escale

		const canvasWidth = canvas.getWidth();
		const canvasHeight = canvas.getHeight();

		// Depois centralize com base nas dimensões reais
		signature.left = (canvasWidth - signature.getScaledWidth()) / 2;
		signature.top = (canvasHeight - signature.getScaledHeight()) / 2;

		canvas.add(signature);
		canvas.renderAll();

		toast(
			<Toasts icon='Check' iconColor='success' title='Sucesso! '>
				Sucesso, encontramos sua assinatura!
			</Toasts>,
			{
				closeButton: true,
				autoClose: 1000,
			},
		);
	};

	const openInput = async () => {
		// @ts-ignore
		inputFile.current.click();
	};

	const handleUpSignature = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const base64 = e.target?.result;
				const newSignature = await loadImage(base64);
				newSignature.set({
					borderColor: 'black',
					cornerColor: 'black',
					cornerStrokeColor: 'black',
					cornerSize: 10,
				});
				const canvasWidth = canvas.getWidth();
				const canvasHeight = canvas.getHeight();
				newSignature.left = (canvasWidth - newSignature.width! * newSignature.scaleX!) / 2;
				newSignature.top = (canvasHeight - newSignature.height! * newSignature.scaleY!) / 2;
				newSignature.scaleToWidth(200);
				canvas.add(newSignature);
				canvas.renderAll();
			};
			reader.readAsDataURL(file);
		}
	};

	const handleKeyDown = (event: any) => {
		if (event.key === 'Delete' || event.key === 'Backspace') {
			removeSelectedObject();
		}
	};

	const removeSelectedObject = () => {
		try {
			setDeleting(true);
			const activeObject = canvas.getActiveObject();
			if (activeObject) {
				canvas.remove(activeObject);
				canvas.renderAll();
			}
		} catch (e) {
			console.log(e);
		}
	};

	// Função para salvar a página atual no array pages
	const saveCurrentPage = () => {
		if (canvasRef.current) {
			const dataURL = canvasRef.current.toDataURL('png', 100);
			setPages((prevPages) => {
				const newPages = [...prevPages];
				newPages[currentPageIndex] = { ...newPages[currentPageIndex], base64: dataURL };
				return newPages;
			});
		}
	};

	// Função para renderizar a página atual
	async function renderCurrentPage() {
		if (!canvas || !pages[currentPageIndex]) return;

		canvas.clear(); // Limpa o canvas atual

		const image = await loadImage(pages[currentPageIndex].base64);

		canvas.setDimensions({
			width: image.width,
			height: image.height,
		});

		image.set({ selectable: false, lockRotation: true });
		canvas.add(image);
		canvas.renderAll();
	}

	// Função para mudar de página
	const changePage = (newIndex: number) => {
		if (newIndex >= 0 && newIndex < pages.length && newIndex !== currentPageIndex) {
			saveCurrentPage(); // Salva a página atual antes de mudar
			setCurrentPageIndex(newIndex); // Atualiza o índice
		}
	};

	useEffect(() => {
		window.document.addEventListener('keydown', handleKeyDown);
		const fetchData = async () => {
			try {
				if (assignature && document && sectionRef.current && canvasRef.current) {
					const canvas = new fabric.Canvas(canvasRef.current);
					setCanvas(canvas);
					const sectionWidth = sectionRef.current.offsetWidth;
					const sectionHeight = sectionRef.current.offsetHeight;
					const canvasWidth = sectionWidth * 0.9;
					const canvasHeight = sectionHeight * 0.9;

					const canvaDocument = await loadImage(
						document.type === 'pdf' ? document.picture[0].base64 : document.path,
					);
					canvas.setDimensions({
						width: canvaDocument.width,
						height: canvaDocument.height,
					});

					canvaDocument.set({
						lockRotation: true,
						selectable: false,
					});

					canvas.add(canvaDocument);
					canvas.renderAll();

					return () => {
						window.document.removeEventListener('keydown', handleKeyDown);
						canvas.dispose();
					};
				}
			} catch (e) {
				console.log('Erro ao configurar o canvas:', e);
			} finally {
				setStart(true);
			}
		};
		fetchData();
	}, [document, assignature, modal, sectionRef.current, canvasRef.current]);

	useEffect(() => {
		if (document && document.picture && document.picture.length > 0) {
			setPages(document.picture);
			setCurrentPageIndex(0);
		}
	}, [document]);

	useEffect(() => {
		if (start && canvas && pages.length > 0) {
			renderCurrentPage();
		}
	}, [currentPageIndex, canvas, start, pages]);

	return (
		<Modal isOpen={modal} setIsOpen={setModal} fullScreen>
			<ModalHeader setIsOpen={setModal}>
				<div className='d-flex align-items-center justify-content-center'>
					<h2>Documento e Assinatura</h2>
				</div>
			</ModalHeader>
			<ModalBody>
				<>
					<section
						className='rounded-lg d-flex align-items-center justify-content-center p-5'
						ref={sectionRef}>
						<canvas className='rounded' ref={canvasRef} />
					</section>
				</>
			</ModalBody>
			<ModalFooter>
				<div className='col-12 d-flex justify-content-end mt-2 gap-4'>
					<input
						type='file'
						id='upload-file'
						ref={inputFile}
						onChange={handleUpSignature}
						className='d-none'
					/>
					<div className='d-flex gap-2 align-items-center'>
						<Button
							onClick={() => changePage(currentPageIndex - 1)}
							icon='ArrowBack'
							color='light'
							isLink
							isDisable={currentPageIndex === 0}></Button>
						<span>
							Página {currentPageIndex + 1} de {pages.length}
						</span>
						<Button
							onClick={() => changePage(currentPageIndex + 1)}
							icon='ArrowForward'
							isLink
							color='light'
							isDisable={currentPageIndex === pages.length - 1}></Button>
					</div>
					<Button
						color='warning'
						icon='Search'
						isLink
						className='d-flex gap-2 align-items-center'
						onClick={findSignatureCollaborator}>
						Assinatura Colaborador
					</Button>
					<Button
						color='success'
						icon='Search'
						isLink
						className='d-flex gap-2 align-items-center'
						onClick={findSignatureCompany}>
						Assinatura Empresa
					</Button>
					<Button
						onClick={openInput}
						isLink
						color='info'
						icon='Upload'
						className='d-flex gap-2 align-items-center'>
						Carregar Assinatura
					</Button>
					{loader ? (
						<Button color='primary' className='d-flex gap-2 align-items-center'>
							<Spinner isSmall />
							Gerando documento assinado
						</Button>
					) : (
						<Button isLight icon='LibraryAdd' color='primary' onClick={saveImage}>
							Gerar documento assinado
						</Button>
					)}
				</div>
			</ModalFooter>
		</Modal>
	);
}
