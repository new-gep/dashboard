import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import Create from '../../../assets/unique/create.png';
import Search from '../../../assets/unique/searchPeople.png';
import My from '../../../assets/unique/marketing.png';

export default function Home() {
	const navigate = useNavigate();
	const dates = [
		{
			id: 'create',
			image: Create,
			title: 'Gerar Vaga',
			description: 'Crie suas vagas e contrate novos colaboradores',
			tags: 'TTags[]',
			color: 'TColor',
		},
		{
			id: 'vacancies',
			image: My,
			title: 'Minhas Vagas',
			description: 'Gerencie e controle suas vagas',
			tags: 'TTags[]',
			color: 'TColor',
		},
		{
			id: 'candidate',
			image: Search,
			title: 'Buscar Candidatos',
			description: 'Busque novos talentos para sua empresa',
			tags: 'TTags[]',
			color: 'TColor',
		},
	];

	const go = (where: any) => {
		switch (where) {
			case 'vacancies':
				navigate('/recruit/vacancies'), [navigate];
				break;
			case 'create':
				navigate('/recruit/create'), [navigate];
				break;
			case 'candidate':
				navigate('/candidate'), [navigate];
				break;

			default:
				break;
		}
	};

	return (
		<section className='d-flex w-100 align-items-center justify-content-center'>
			<div className='d-flex w-100 align-items-center justify-content-center row gap-5 '>
				{dates.map((item: any) => {
					return (
						<Card
							className='col-3 cursor-pointer shadow-3d-primary shadow-3d-hover '
							onClick={() => {
								go(item.id);
							}}
							data-tour={item.title}>
							<CardBody>
								<div
									className={classNames(
										'ratio ratio-1x1',
										'rounded-2',
										`bg-l${item.darkModeStatus ? 'o25' : '10'}-${item.color}`,
										'mb-3',
									)}>
									<img
										src={item.image}
										alt=''
										width='100%'
										height='auto'
										className='object-fit-contain p-3'
									/>
								</div>
								<CardTitle tag='div' className='h5'>
									{item.title}
								</CardTitle>
								<p className='text-muted truncate-line-2'>{item.description}</p>
								<div className='row g-2' />
							</CardBody>
						</Card>
					);
				})}
			</div>
		</section>
	);
}
