import * as React from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Spinner from '../../../../../components/bootstrap/Spinner'; 

export default function SelectOptionJob({
	setDecision,
	setInitial,
	setSendFunction,
	loader
}: {
	setSendFunction: any;
	setDecision: any;
	setInitial: any;
	loader:any
}) {
	const decision = (decision: string) => {
		switch (decision) {
			case 'manual':
				setDecision('manual');
				setInitial(true);
				break;
			case 'ia':
				setDecision('ia');
				break;
			default:
				console.log(decision);
				break;
		}
	};

	return (
		<div className='d-flex flex-column justify-content-center align-items-center h-100'>
			<h5 className='text-center'>Como você gostaria de seguir com a criação da vaga?</h5>
			<p className='text-muted'>Selecione uma opção para continuar</p>
			{ loader ?
				<>
					<div className='mt-5'>
						<h4>Gerando sua Vaga</h4>
					</div>
					<div className="spinner-border spinner-border-sm m-0 p-0" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
				</>
				:
				<>
					<div className='d-flex flex-column w-50'>
						<Button
							color='primary'
							isLight
							className='mt-5 mb-2'
							icon='FrontHand'
							onClick={() => decision('manual')}>
							Manual
						</Button>
						<Button
							color='storybook'
							isLight
							icon='robot'
							onClick={() => decision('ia')}>
							IA
						</Button>
					</div>
					<div className='w-100 mt-4'>
						<Button
							icon='ArrowBack'
							onClick={() => {
								setSendFunction(false);
							}}>
							Voltar
						</Button>
					</div>
				</>
			}
		</div>
	);
}
