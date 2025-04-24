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

export default function FormJob({ formik, setInitial }: { formik: any; setInitial: any }) {
	const [newBenefitName, setNewBenefitName] = React.useState('');
	const [AddBenefit, setAddBenefit] = React.useState<boolean>(false);
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

	const handleToggleSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selected = e.target.value;
		if (!selected) return;

		const alreadyAdded = skills.find((s: any) => s.name === selected);

		if (alreadyAdded) {
			// Remove se já estiver
			setSkills((prev: any) => prev.filter((s: any) => s.name !== selected));
		} else {
			// Adiciona se não estiver
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

		// Limpa seleção visual
		e.target.value = '';
	};

	const options = [
		{ name: 'Comunicação', icon: 'aa' },
		{ name: 'Trabalho em equipe', icon: 'aa' },
		{ name: 'Proatividade', icon: 'aa' },
		{ name: 'Organização', icon: 'aa' },
		{ name: 'Adaptabilidade', icon: 'aa' },
	];

	const removeSkill = (id: number) => {
		setSkills((prev: any) => prev.filter((skill: any) => skill.id !== id));
	};

	return (
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
							type='number'
							onChange={formik.handleChange}
							value={formik.values.salary}
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
					<FormGroup id='journey'>
						<Select
							className='form-select fw-medium'
							required={true}
							ariaLabel='Modelo de Trabalho'
							placeholder='Modelo de Trabalho'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.journey}
							isValid={formik.isValid}
							isTouched={formik.touched.journey}
							invalidFeedback={formik.errors.journey}
							validFeedback='Ótimo!'>
							<option value='presential'>Presencial</option>
							<option value='hybrid'>Híbrido</option>
							<option value='remote'>Remoto</option>
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
							<Option value='clt'>CLT</Option>
							<Option value='pj'>PJ</Option>
							<Option value='contract'>Contrato</Option>
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
							isValid={formik.isValid}
							isTouched={formik.touched.cep}
							invalidFeedback={formik.errors.cep}
							validFeedback='Ótimo!'
						/>
					</FormGroup>
				</div>
				<div className='col-10'>
					<FormGroup id='logradouro' label='Logradouro' isFloating>
						<Input
							placeholder='Logradouro'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.logradouro}
							isValid={formik.isValid}
							isTouched={formik.touched.logradouro}
							invalidFeedback={formik.errors.logradouro}
							validFeedback='Ótimo!'
						/>
					</FormGroup>
				</div>
			</div>

			<div className='col-12 g-2 mt-3'>
				<FormGroup id='obligations' label='Responsabilidades' isFloating>
					<Textarea
						onChange={formik.handleChange}
						value={formik.values.obligations}
						onBlur={formik.handleBlur}
						isValid={formik.isValid}
						isTouched={formik.touched.obligations}
						invalidFeedback={formik.errors.obligations}
						validFeedback='Ótimo!'
					/>
				</FormGroup>
			</div>

			<div className='col-12 mb-2 mt-3 g-2'>
				<FormGroup id='benefits' label='Requisitos' isFloating>
					<Textarea
						onChange={formik.handleChange}
						value={formik.values.benefits}
						onBlur={formik.handleBlur}
						isValid={formik.isValid}
						isTouched={formik.touched.benefits}
						invalidFeedback={formik.errors.benefits}
						validFeedback='Ótimo!'
					/>
				</FormGroup>
			</div>

			<div>
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

				<FormGroup id='journey'>
					<Select
						className='form-select fw-medium'
						aria-label='competências'
						placeholder='competências'
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleToggleSkill(e)}
						ariaLabel={''}>
						{options.map((opt) => (
							<option
								key={opt.name}
								value={opt.name}
								className={
									skills.some((s:any) => s.name === opt.name) ? 'text-muted' : ''
								}>
								{opt.name}
							</option>
						))}
					</Select>
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
				</div>
			</div>

			<div className='w-100 d-flex justify-content-end'>
				<Button
					icon='ArrowBack'
					style={{ marginRight: '2%' }}
					onClick={() => {
						setInitial(false);
					}}>
					Voltar
				</Button>
				<Button icon='save' color='success' isLight>
					Salvar
				</Button>
			</div>
		</section>
	);
}
