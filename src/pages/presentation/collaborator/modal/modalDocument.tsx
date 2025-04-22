import { useState } from 'react';
import Button from '../../../../components/bootstrap/Button';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../../../../components/bootstrap/Modal';

interface ModalDocumentProps {
	typeDocument: string;
	pathDocumentMain: any;
	pathDocumentSecondary?: string;
	openModal: boolean;
	closeModal: (value: boolean) => void;
}

export default function ModalDocument({
	typeDocument,
	pathDocumentMain,
	pathDocumentSecondary,
	openModal,
	closeModal,
}: ModalDocumentProps) {
	const [typeChildren, setTypeChildren] = useState<any>(null);
	const [pathDocumentChildren, setPathDocumentChildren] = useState<any>(null);

	const selectChildren = (children: any) => {
		setTypeChildren(children.type);
		setPathDocumentChildren(children.base64Data);
	};

	const closeSelectChildren = () => {
		setTypeChildren(null);
		setPathDocumentChildren(null);
	};

	return (
		<Modal isOpen={openModal} setIsOpen={closeModal} size='xl'>
			<ModalHeader>
				<div>
					<h1 className='mb-0 p-0'>Documento</h1>
					<p className='mt-0 p-0'>
						Avalie o documento {typeDocument == 'children' && 'dos filhos'}
					</p>
				</div>
			</ModalHeader>
			<ModalBody>
				{typeDocument == 'pdf' && (
					<iframe
						title='Conteúdo incorporado da página'
						src={pathDocumentMain}
						className='rounded-md left-5'
						style={{ height: '500px', width: '100%', borderRadius: '10px' }}
					/>
				)}
				{typeDocument == 'picture' && (
					<div className='d-flex gap-4'>
						<img
							title='Documento'
							src={pathDocumentMain}
							className='rounded-md left-5'
							style={{ height: '500px', width: '100%', borderRadius: '10px' }}
						/>

						{pathDocumentSecondary && (
							<img
								title='Documento'
								src={pathDocumentSecondary}
								className='rounded-md left-5'
								style={{ height: '500px', width: '100%', borderRadius: '10px' }}
							/>
						)}
					</div>
				)}
				{typeDocument == 'children' && (
					<div className='d-flex gap-4'>
						{pathDocumentMain.map((path: any) => {
							return (
								<>
									{!typeChildren && !pathDocumentChildren && (
										<div>
											<Button
												onClick={() => selectChildren(path)}
												icon='ChildCare'
												isLight
												color='primary'>
												{path.name}
											</Button>
										</div>
									)}
								</>
							);
						})}
						{typeChildren == 'pdf' && (
							<iframe
								title='Conteúdo incorporado da página'
								src={pathDocumentChildren}
								className='rounded-md left-5'
								style={{ height: '500px', width: '100%', borderRadius: '10px' }}
							/>
						)}
						{typeChildren == 'picture' && (
							<img
								title='Documento'
								src={pathDocumentChildren}
								className='rounded-md left-5'
								style={{ height: '500px', width: '100%', borderRadius: '10px' }}
							/>
						)}
					</div>
				)}
			</ModalBody>
			<ModalFooter>
				{/* {(typeDocument == 'pdf' || typeDocument == 'picture') && (
                    <div className='d-flex gap-4'>
                        <Button
                            isLight={true}
                            color='danger'
                            // onClick={() => AvaliationPicture(false)}
                            // size='lg'
                        >
                            Recusar
                        </Button>
                        <Button
                            isLight={true}
                            color='success'
                            // onClick={() => AvaliationPicture(true)}
                            // size='lg'
                        >
                            Aprovar
                        </Button>
                    </div>
                )} */}
				{typeDocument == 'children' && typeChildren == null && (
					<Button
						isLight
						color='info'
						onClick={closeModal}
						// size='lg'
					>
						Fechar
					</Button>
				)}

				{typeChildren && pathDocumentChildren && (
					<div className='d-flex gap-4'>
						<Button
							isLight
							color='light'
							onClick={closeSelectChildren}
							// size='lg'
						>
							Voltar
						</Button>
					</div>
				)}
			</ModalFooter>
		</Modal>
	);
}
