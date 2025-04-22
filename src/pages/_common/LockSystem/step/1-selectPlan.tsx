import Button from '../../../../components/bootstrap/Button';
import Icon from '../../../../components/icon/Icon';

import Card, { CardBody } from '../../../../components/bootstrap/Card';

interface SelectPlanProps {
	setStep: any;
	setPlan: any;
	plan: any;
}

export default function SelectPlan(props: SelectPlanProps) {
	const handlePlan = (plan: any) => {
		switch (plan) {
			case '1':
				props.setPlan({
					name: 'Startup Company',
					icon: 'CustomRocketLaunch',
					price: '219',
					discount: '0',
					collaborators: 10,
				});
				break;
			case '2':
				props.setPlan({
					name: 'Mid-Size Company',
					icon: 'Maps Home Work',
					price: '500',
					discount: '0',
					collaborators: 10,
				});
				break;

			case '3':
				props.setPlan({
					name: 'Large Company',
					icon: 'CustomFactory',
					price: '800',
					discount: '0',
					collaborators: 10,
				});
		}
		props.setStep(2);
	};

	return (
		<div id='first' className='row scroll-margin'>
			{/* <div className='col-12 mb-3'>
                <div className='display-4 fw-bold py-3'>Design 1</div>
            </div> */}
			<div className='col-md-3'>
				<Card stretch className='bg-transparent' shadow='none'>
					<CardBody>
						<div className='h-100 d-flex align-items-center justify-content-center'>
							<div className='row text-center'>
								<div className='col-12 text-uppercase fw-light'>Por mês</div>
								<div className='col-12 text-uppercase h2 fw-bold mb-2'>
									Selecione o <br />
									<span className='text-success'>seu</span>
									<br /> plano perfeito
								</div>
								<div className='col-12 mb-2'>
									Otimize processos, reduza retrabalho e tenha mais eficiência na
									gestão de pessoas. Nosso sistema automatiza tarefas repetitivas
									e melhora a tomada de decisões. Assine agora e leve o RH da sua
									empresa para o próximo nível!
								</div>
								<div className='col-12 justify-content-center align-items-center d-flex mt-5'>
									<Icon icon='Verified' size='5x' color='info' />
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>

			<div className='col-md-3'>
				<Card>
					<CardBody>
						<div className='row pt-5 g-4 text-center'>
							<div className='col-12'>
								<Icon icon='CustomRocketLaunch' size='7x' color='info' />
							</div>
							<div className='col-12'>
								<h2>Startup Company</h2>
							</div>
							<div className='col-12'>
								<h3 className='display-1 fw-bold'>
									<span className='display-4 fw-bold'>$</span>219
									<span className='display-6'>/mo</span>
								</h3>
							</div>
							<div className='col-12'>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Exclusive Workspace
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Internet Connection
								</div>
								<div className='lead text-muted'>
									<Icon icon='Close' color='danger' /> Meeting Room
								</div>
								<div className='lead text-muted'>
									<Icon icon='Close' color='danger' /> Small Rest Room
								</div>
							</div>
							<div className='col-12'>
								<p>Lorem ipsum dolor sit amet.</p>
							</div>
							<div className='col-12'>
								<Button
									color='info'
									isLight
									className='w-100 py-3 text-uppercase'
									size='lg'
									onClick={() => handlePlan('1')}>
									Select Plan
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
			<div className='col-md-3'>
				<Card>
					<CardBody>
						<div className='row pt-5 g-4 text-center'>
							<div className='col-12'>
								<Icon icon='Maps Home Work' size='7x' color='success' />
							</div>
							<div className='col-12'>
								<h2>Mid-Size Company</h2>
							</div>
							<div className='col-12'>
								<h3 className='display-1 fw-bold'>
									<span className='display-4 fw-bold'>$</span>339
									<span className='display-6'>/mo</span>
								</h3>
							</div>
							<div className='col-12'>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Exclusive Workspace
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Internet Connection
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Five Meeting Room
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Small Rest Room
								</div>
							</div>
							<div className='col-12'>
								<p>Lorem ipsum dolor sit amet.</p>
							</div>
							<div className='col-12'>
								<Button
									color='success'
									className='w-100 py-3 text-uppercase'
									size='lg'
									onClick={() => handlePlan('2')}>
									Select Plan
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
			<div className='col-md-3'>
				<Card>
					<CardBody>
						<div className='row pt-5 g-4 text-center'>
							<div className='col-12'>
								<Icon icon='CustomFactory' size='7x' color='info' />
							</div>
							<div className='col-12'>
								<h2>Large Company</h2>
							</div>
							<div className='col-12'>
								<h3 className='display-1 fw-bold'>
									<span className='display-4 fw-bold'>$</span>339
									<span className='display-6'>/mo</span>
								</h3>
							</div>
							<div className='col-12'>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Exclusive Workspace
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Internet Connection
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Five Meeting Room
								</div>
								<div className='lead'>
									<Icon icon='Done Outline' color='success' /> Large Rest Room
								</div>
							</div>
							<div className='col-12'>
								<p>Lorem ipsum dolor sit amet.</p>
							</div>
							<div className='col-12'>
								<Button
									color='info'
									isLight
									className='w-100 py-3 text-uppercase'
									size='lg'
									onClick={() => handlePlan('3')}>
									Select Plan
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
