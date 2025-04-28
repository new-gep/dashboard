import Checks from '../../../../../components/bootstrap/forms/Checks';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Icon from '../../../../../components/icon/Icon';
import Option from '../../../../../components/bootstrap/Option';
import Textarea from '../../../../../components/bootstrap/forms/Textarea';
import { CardTitle } from '../../../../../components/bootstrap/Card';
import Button from '../../../../../components/bootstrap/Button';
import * as React from 'react';
import Label from '../../../../../components/bootstrap/forms/Label';
import Mask from '../../../../../function/Mask';
import Job from '../../../../../api/post/Job';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
} from '../../../../../components/bootstrap/Modal';
import Preview from './preview';

export default function FormJob({
	formik,
	setInitial,
	setIAactive,
}: {
	formik: any;
	setInitial: any;
	setIAactive: any;
}) {
	const [newBenefitName, setNewBenefitName] = React.useState('');
	const [preview, setPreview] = React.useState<boolean>(false);
	const [AddBenefit, setAddBenefit] = React.useState<boolean>(false);
	const [searchTerm, setSearchTerm] = React.useState<any>('');
	const [benefit, setBenefit] = React.useState<any>([
		{
			id: 1,
			icon: 'DirectionsBus',
			name: 'VT',
			active: false,
		},
		{
			id: 2,
			icon: 'Restaurant',
			name: 'VA',
			active: false,
		},
		{
			id: 3,
			icon: 'Fastfood',
			name: 'VR',
			active: false,
		},
		{
			id: 4,
			icon: 'FitnessCenter',
			name: 'Gympass',
			active: false,
		},
		{
			id: 5,
			icon: 'MedicalServices',
			name: 'Plano de Saúde',
			active: false,
		},
		{
			id: 6,
			icon: 'Dentist',
			name: 'Odontológico',
			active: false,
		},
		{
			id: 7,
			icon: 'AttachMoney',
			name: 'PLR',
			active: false,
		},
		{
			id: 8,
			icon: 'ChildFriendly',
			name: 'Auxilio Creche',
			active: false,
		},
		{
			id: 9,
			icon: 'cake',
			name: 'Day Off',
			active: false,
		},
	]);
	const [skills, setSkills] = React.useState<any>(
		[] as Array<{ id: number; icon: string; name: string; active: boolean }>,
	);

	const handleToggleSkill = (
		e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } },
	) => {
		const selected = e.target.value;
		if (!selected) return;

		const alreadyAdded = skills.find((s: any) => s.name === selected);

		if (alreadyAdded) {
			// Se já existe, remove do skills
			setSkills((prev: any) => prev.filter((s: any) => s.name !== selected));
		} else {
			// Se não existe, adiciona
			const skillData = options.find((opt) => opt.name === selected);
			setSkills((prev: any) => [
				...prev,
				{
					id: Date.now(),
					name: skillData?.name || selected,
					icon: skillData?.icon || 'Lightbulb',
				},
			]);
		}

		// Limpa o input
		if ('target' in e) {
			e.target.value = '';
		}
		setSearchTerm('');
	};

	const formatMoney = (value: string) => {
		if (!value) return '';

		// Remove tudo que não for número
		let cleaned = value.replace(/\D/g, '');

		// Se for vazio, retorna R$ 0,00
		if (cleaned.length === 0) return 'R$ 0,00';

		// Converte para número e força no formato de centavos
		const numberValue = parseInt(cleaned, 10);

		// Divide por 100 para colocar centavos
		const floatValue = numberValue / 100;

		// Formata com padrão brasileiro (pt-BR)
		return floatValue.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});
	};

	const options = [
		{ name: 'Adaptabilidade', icon: 'aa' },
		{ name: 'Banco de dados', icon: 'aa' },
		{ name: 'Comunicação', icon: 'aa' },
		{ name: 'Comprometimento', icon: 'aa' },
		{ name: 'Criatividade', icon: 'aa' },
		{ name: 'Design gráfico', icon: 'aa' },
		{ name: 'Edição de vídeos', icon: 'aa' },
		{ name: 'Flexibilidade', icon: 'aa' },
		{ name: 'Fluência em idiomas', icon: 'aa' },
		{ name: 'Gestão de contabilidade', icon: 'aa' },
		{ name: 'Gestão de redes sociais', icon: 'aa' },
		{ name: 'Gestão de tempo', icon: 'aa' },
		{ name: 'Liderança', icon: 'aa' },
		{ name: 'Linguagens de programação', icon: 'aa' },
		{ name: 'Microsoft Office', icon: 'aa' },
		{ name: 'Organização', icon: 'aa' },
		{ name: 'Pensamento analítico', icon: 'aa' },
		{ name: 'Pensamento lógico', icon: 'aa' },
		{ name: 'Planejamento', icon: 'aa' },
		{ name: 'Pesquisar informações', icon: 'aa' },
		{ name: 'Proatividade', icon: 'aa' },
		{ name: 'Relacionamento interpessoal', icon: 'aa' },
		{ name: 'Resiliência', icon: 'aa' },
		{ name: 'Resolução de problemas', icon: 'aa' },
		{ name: 'SEO', icon: 'aa' },
		{ name: 'Sentido de ética', icon: 'aa' },
		{ name: 'Softwares de Marketing', icon: 'aa' },
		{ name: 'Softwares de gestão de projetos', icon: 'aa' },
		{ name: 'Transparência', icon: 'aa' },
		{ name: 'Trabalho em equipe', icon: 'aa' },
	];

	const filteredOptions = options.filter(
			(opt: any) =>
				opt.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				!skills.some((s: any) => s.name === opt.name), // já selecionadas não aparecem
	).slice(0, 6);

	const saveJob = async () => {
		console.log(formik.values);
		// const PropsCreateJob = {
		// 	benefits: 'string',
		// 	contract: 'string',
		// 	details: 'string',
		// 	image: 'string',
		// 	function: 'string',
		// 	obligations: 'string',
		// 	salary: 'string',
		// 	time: {},
		// 	user_update: 'string',
		// };
		// const response = await Job(PropsCreateJob);
	};

	return (
		<>
			<Preview formik={formik} skills={skills} benefit={benefit} setPreview={setPreview} preview={preview} saveJob={saveJob} />
			<section className='row g-4'>
				<div className='d-flex col-12'>
					<div className=' d-flex align-items-center'>
						<Icon icon={'Accessible'} color={'success'} size={'2x'} />
						<div className='ms-2'>
							<Checks
								isInline
								type={'switch'}
								label={'PCD'}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									const isChecked = event.target.checked;
									formik.setFieldValue('PCD', isChecked ? '1' : '0');
								}}
								checked={formik.values.PCD === '1'}
							/>
						</div>
					</div>

					<div className=' d-flex align-items-center'>
						<Icon icon={'Dei'} color={'success'} size={'2x'} />
						<div className='ms-2'>
							<Checks
								isInline
								type={'switch'}
								label={'DEI'}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									const isChecked = event.target.checked;
									formik.setFieldValue('DEI', isChecked ? '1' : '0');
								}}
								checked={formik.values.DEI === '1'}
							/>
						</div>
					</div>
				</div>

				<div className='row g-2'>
					<div className='col-8'>
						<FormGroup id='function' label='Função' isFloating>
							<Input
								disabled
								className='text-capitalize'
								placeholder='Função'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.function}
								isValid={formik.isValid}
								isTouched={formik.touched.function}
								invalidFeedback={formik.errors.function}
								validFeedback='Ótimo!'
							/>
						</FormGroup>
					</div>
					<div className='col-4'>
						<FormGroup id='salary' label='Salário' isFloating>
							<Input
								onChange={(e) => {
									formik.handleChange(e);
									// handleMaskChange(e); // Atualiza o campo com o valor "limpo"
								}}
								value={formatMoney(formik.values.salary)}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.salary}
								invalidFeedback={formik.errors.salary}
								validFeedback='Ótimo!'
							/>
						</FormGroup>
					</div>
				</div>

				<div className='row g-2'>
					<div className='col-6'>
						<FormGroup id='model'>
							<Select
								className='form-select fw-medium'
								required={true}
								ariaLabel='Modelo de Trabalho'
								placeholder='Modelo de Trabalho'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.model}
								isValid={formik.isValid}
								isTouched={formik.touched.model}
								invalidFeedback={formik.errors.model}
								validFeedback='Ótimo!'>
								<option value='Presencial'>Presencial</option>
								<option value='Híbrido'>Híbrido</option>
								<option value='Remoto'>Remoto</option>
							</Select>
						</FormGroup>
					</div>
					<div className='col-6'>
						<FormGroup id='contract'>
							<Select
								className='form-select fw-medium'
								required={true}
								ariaLabel='Contratação'
								placeholder='Contratação'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.contract}
								isValid={formik.isValid}
								isTouched={formik.touched.contract}
								invalidFeedback={formik.errors.contract}
								validFeedback='Ótimo!'>
								<Option value='CLT'>CLT</Option>
								<Option value='PJ'>PJ</Option>
								<Option value='Contrato'>Contrato</Option>
							</Select>
						</FormGroup>
					</div>
				</div>

				<div className='row g-2'>
					<div className='col-2'>
						<FormGroup id='cep' label='CEP' isFloating>
							<Input
								placeholder='CEP'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.cep}
								mask='99999-999'
								isValid={formik.isValid}
								isTouched={formik.touched.cep}
								invalidFeedback={formik.errors.cep}
								validFeedback='Ótimo!'
							/>
						</FormGroup>
					</div>
					<div className='col-10'>
						<FormGroup id='locality' label='Localidade' isFloating>
							<Input
								placeholder='Localidade'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.locality}
								isValid={formik.isValid}
								isTouched={formik.touched.locality}
								invalidFeedback={formik.errors.locality}
								validFeedback='Ótimo!'
							/>
						</FormGroup>
					</div>
				</div>

				<div className='col-12 g-2 mt-3'>
					<FormGroup id='responsibility' label='Responsabilidades' isFloating>
						<Textarea
							onChange={formik.handleChange}
							value={formik.values.responsibility}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.responsibility}
							invalidFeedback={formik.errors.responsibility}
							validFeedback='Ótimo!'
						/>
					</FormGroup>
				</div>

				<div className='col-12 mb-2 mt-3 g-2'>
					<FormGroup id='requirements' label='Requisitos' isFloating>
						<Textarea
							onChange={formik.handleChange}
							value={formik.values.requirements}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.requirements}
							invalidFeedback={formik.errors.requirements}
							validFeedback='Ótimo!'
						/>
					</FormGroup>
				</div>

				<div>
					<div className='d-flex align-items-center'>
						<Icon
							color='success'
							style={{ marginRight: '1%', userSelect: 'none' }}
							icon='Lightbulb'
							size={'2x'}
						/>
						<CardTitle className='mb-0' style={{ userSelect: 'none' }}>
							Competências
						</CardTitle>
					</div>

					<Label className='mt-1 p-0' style={{ userSelect: 'none' }}>
						{!AddBenefit
							? 'Adicione competências para maior chances de acerto'
							: 'Adicione seu benefício, e torne mais atrativo sua vaga'}
					</Label>

					<FormGroup id='competence'>
						<div className='relative w-full d-flex'>
							<Input
								type='text'
								className='form-input fw-medium pr-10 w-100'
								placeholder='Digite uma competência'
								value={searchTerm}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setSearchTerm(e.target.value)
								}
							/>
						</div>

						{searchTerm && (
							<div className='border mt-2 max-h-60 overflow-y-auto'>
								{filteredOptions.length > 0 ? (
									filteredOptions.map((opt: any) => (
										<div
											key={opt.name}
											className='p-2 hover:bg-gray-100 cursor-pointer'
											onClick={() => {
												handleToggleSkill({
													target: { value: opt.name },
												} as any);
												setSearchTerm(''); // limpa o input
											}}>
											{opt.name}
										</div>
									))
								) : (
									<div className='p-2 text-gray-500'>
										Nenhuma competência encontrada
									</div>
								)}
							</div>
						)}
					</FormGroup>

					<div className='mt-3'>
						{skills.map((item: any) => {
							return (
								<Button
									color={'primary'}
									isLink={item.active}
									icon={item.icon}
									className='text-capitalize'
									// size={'lg'}
									onClick={() => {
										setSkills((prev: any[]) =>
											prev.filter((b) => b.id !== item.id),
										);
									}}>
									{item.name}
								</Button>
							);
						})}
					</div>
				</div>

				<>
					<div className='mt-5'>
						<div className='d-flex align-items-center'>
							<Icon
								color='success'
								style={{ marginRight: '1%', userSelect: 'none' }}
								icon='CardGiftcard'
								size={'2x'}
							/>
							<CardTitle className='mb-0' style={{ userSelect: 'none' }}>
								Benefícios
							</CardTitle>
						</div>

						<Label className='mt-1 p-0' style={{ userSelect: 'none' }}>
							{!AddBenefit
								? 'Clique em cima, e torne mais atrativo sua vaga'
								: 'Adicione seu benefício, e torne mais atrativo sua vaga'}
						</Label>
					</div>

					{!AddBenefit ? (
						<div className='col-12 g-2'>
							{benefit.map((item: any) => {
								return (
									<Button
										color={item.active ? 'primary' : 'light'}
										isLink={!item.active}
										icon={item.icon}
										className='text-capitalize'
										// size={'lg'}
										onClick={() => {
											setBenefit((prev: any[]) =>
												prev.map((b) =>
													b.id === item.id
														? {
																...b,
																active: !b.active,
															}
														: b,
												),
											);
										}}>
										{item.name}
									</Button>
								);
							})}
							<Button
								className='text-capitalize'
								color='success'
								isLink={true}
								icon={'ControlPoint'}
								size={'lg'}
								onClick={() => {
									setAddBenefit(!AddBenefit);
								}}
							/>
						</div>
					) : (
						<div className='d-flex g-2'>
							<Button
								color='danger'
								isLink={true}
								icon={'RemoveCircle'}
								size={'lg'}
								onClick={() => {
									setAddBenefit(!AddBenefit);
								}}
							/>

							<FormGroup
								className='col-5'
								id='Benefit'
								label='Benefício Adicional'
								isFloating>
								<Input
									className='text-capitalize'
									placeholder='Benefício Adicional'
									value={newBenefitName}
									onChange={(e: any) => setNewBenefitName(e.target.value)}
									onBlur={formik.handleBlur}
								/>
							</FormGroup>

							<Button
								color='success'
								isLink={true}
								icon={'CheckCircle'}
								size={'lg'}
								onClick={() => {
									if (!newBenefitName.trim()) return;
									const newBenefit = {
										id: benefit.length + 1, // ou use outro sistema de ID único se precisar
										icon: 'ControlPoint',
										name: newBenefitName,
										active: true,
									};
									setAddBenefit(!AddBenefit);
									setNewBenefitName('');
									setBenefit((prev: any) => [...prev, newBenefit]);
								}}
							/>
						</div>
					)}
				</>

				<div className='w-100 d-flex justify-content-end'>
					<Button
						icon='ArrowBack'
						style={{ marginRight: '2%' }}
						onClick={() => {
							setInitial(false);
							setIAactive(false);
						}}>
						Voltar
					</Button>
					<Button
						type='submit'
						icon='RemoveRedEye'
						isLight
						onClick={async () => {
							const errors = await formik.validateForm(); // chama validação manual
							if (Object.keys(errors).length === 0) {
								// Se não houver erros
								setPreview(true);
							} else {
								formik.setTouched(
									// Marca todos campos como "tocados" para mostrar erros
									Object.keys(formik.values).reduce(
										(acc, key) => ({ ...acc, [key]: true }),
										{},
									),
								);
							}
						}}>
						Preview
					</Button>
				</div>
			</section>
		</>
	);
}
