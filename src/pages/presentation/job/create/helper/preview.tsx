import React from 'react';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../../../../components/bootstrap/Modal';
import Button from '../../../../../components/bootstrap/Button';
import Icon from '../../../../../components/icon/Icon';

type PreviewProps = {
	formik: any;
	skills: any[];
	benefit: any[];
	setPreview: any;
	preview: any;
	saveJob: any;
};
export default function Preview({
	formik,
	skills,
	benefit,
	preview,
	setPreview,
	saveJob,
}: PreviewProps) {
	return (
		<Modal isOpen={preview} setIsOpen={setPreview} size='lg'>
			<ModalHeader className='d-flex justify-content-between'>
				<h2>Preview</h2>
			</ModalHeader>
			<ModalBody>
				<section className='p-4 border rounded'>
					<div className='d-flex justify-content-between mb-3'>
						<h4>Programador Junior</h4>
						<h4>R$ 1.350,00</h4>
					</div>

					<div className='d-flex gap-5 mb-3'>
						<div className='d-flex justify-content-center align-items-center'>
                            <Icon
                                color='success'
                                style={{ marginRight: '1%', userSelect: 'none' }}
                                icon='Accessible'
                                size={'2x'}
                            />
							<strong>PCD: </strong> {formik.values.PCD === '1' ? 'Sim' : 'Não'}
						</div>
						<div className='d-flex justify-content-center align-items-center'>
                            <Icon
                                color='success'
                                style={{ marginRight: '1%', userSelect: 'none' }}
                                icon='Dei'
                                size={'2x'}
                            />
							<strong>DEI: </strong> {formik.values.DEI === '1' ? 'Sim' : 'Não'}
						</div>
					</div>

					<div className='mb-3'>
						<strong>Modelo de Trabalho:</strong>{' '}
						{formik.values.model || 'Não informado'}
					</div>

					<div className='mb-3'>
						<strong>Tipo de Contratação:</strong>{' '}
						{formik.values.contract || 'Não informado'}
					</div>

					<div className='mb-3'>
						<strong>CEP:</strong> {formik.values.cep || 'Não informado'}
					</div>

					<div className='mb-3'>
						<strong>Localidade:</strong> {formik.values.locality || 'Não informado'}
					</div>

					<div className='mb-3'>
						<strong>Responsabilidades:</strong>
						<p>{formik.values.responsibility || 'Não informado'}</p>
					</div>

					<div className='mb-3'>
						<strong>Requisitos:</strong>
						<p>{formik.values.requirements || 'Não informado'}</p>
					</div>

					<div className='mb-3'>
						<Icon
							color='success'
							style={{ marginRight: '1%', userSelect: 'none' }}
							icon='Lightbulb'
							size={'2x'}
						/>
						<strong>Competências:</strong>
						<div className='d-flex flex-wrap gap-2 mt-2'>
							{skills.length > 0 ? (
								skills.map((skill) => (
									<span key={skill.id} className='p-2 bg-primary rounded fw-bold'>
										{skill.name}
									</span>
								))
							) : (
								<span className='text-muted'>Nenhuma competência adicionada</span>
							)}
						</div>
					</div>

					<div className='mb-3'>
						<Icon
							color='success'
							style={{ marginRight: '1%', userSelect: 'none' }}
							icon='CardGiftcard'
							size={'2x'}
						/>
						<strong>Benefícios:</strong>
						<div className='d-flex flex-wrap gap-2 mt-2'>
							{benefit.filter((b) => b.active).length > 0 ? (
								benefit
									.filter((b) => b.active)
									.map((b) => (
										<Button
											isOutline
											color={'primary'}
											isLink={b.active}
											icon={b.icon}
											className='text-capitalize'>
											{b.name}
										</Button>
									))
							) : (
								<span className='text-muted'>Nenhum benefício selecionado</span>
							)}
						</div>
					</div>
				</section>
			</ModalBody>

			<ModalFooter>
				<Button
					color='info'
					isLink
					onClick={() => {
						setPreview(false);
					}}>
					Fechar
				</Button>
				<Button icon='save' color='success' isLight onClick={saveJob}>
					Salvar
				</Button>
			</ModalFooter>
		</Modal>
	);
}
