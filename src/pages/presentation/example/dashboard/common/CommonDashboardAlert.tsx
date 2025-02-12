import React, { useEffect } from 'react';
import Alert, { AlertHeading } from '../../../../../components/bootstrap/Alert';

const CommonDashboardAlert = () => {

	useEffect(()=>{
		
	},[])

	return (
		<Alert
			icon='Verified'
			isLight
			color='primary'
			borderWidth={0}
			className='shadow-3d-primary'
			isDismissible>
			<AlertHeading tag='h2' className='h4'>
				Parabéns! 🎉
			</AlertHeading>
			<span>O pagamento do seu plano está em dia.</span>
		</Alert>
	);
};

export default CommonDashboardAlert;
