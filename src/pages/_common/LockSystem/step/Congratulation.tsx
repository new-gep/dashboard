import React from 'react';
import HumanHappy from '../../../../assets/humans/happy.png';

export default function Congratulation() {
	return (
		<div>
			<div className='d-flex justify-content-between'>
				<div>
					<h1>Parabéns 🎉</h1>
					<p className='text-muted'>Pagamento realizado com sucesso! 🎊</p>
				</div>
				<div className='d-flex flex-column align-items-center'>
					<span>👆</span>
					<p>Fechar</p>
				</div>
			</div>
			<div className='d-flex justify-content-center align-items-center'>
				<img
					src={HumanHappy}
					alt='Human Happy'
					className='img-fluid'
					style={{ marginLeft: '25%' }}
				/>
			</div>
		</div>
	);
}
