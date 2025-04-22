import { useContext, useEffect, useState } from 'react';
import ContractSignedDocument from '../../../../components/canva/signatures/Contract';
import AuthContext from '../../../../contexts/authContext';
import GetCompanyContract from '../../../../api/get/company/Contract';
import Button from '../../../../components/bootstrap/Button';
import Laptop from '../../../../assets/humans/laptop.png';

interface ContractPlanProps {
	plan: any;
	setStep: any;
}

export default function ContractPlan(props: ContractPlanProps) {
	const [modal, setModal] = useState(false);
	const [document, setDocument] = useState(null);
	const [cpnj, setCpnj] = useState(null);
	const { userData } = useContext(AuthContext);

	useEffect(() => {
		GetCompanyContract('userData.cnpj', '1').then((res) => {
			setDocument(res);
		});
		if (userData) {
			setCpnj(userData.cnpj);
		}
	}, [userData]);

	const closeAfterSave = () => {
		props.setStep(4);
		setModal(false);
	};

	return (
		<div>
			<h1>Assinatura do Contrato</h1>
			<p className='mb-4 text-muted'>
				Na próxima etapa, você encontrará o contrato para assinatura com a empresa New GEP.
			</p>
			<div className='d-flex flex-column justify-content-center align-items-center'>
				<img
					src={Laptop}
					alt='Laptop'
					className='img-fluid'
					style={{ maxHeight: '50vh', width: 'auto', marginLeft: '9%' }}
				/>
				{document ? (
					<Button
						onClick={() => {
							setModal(true);
						}}
						color='primary'
						icon='EditDocument'>
						Visualizar e Assinar Contrato
					</Button>
				) : (
					<Button color='primary' icon='EditDocument' isDisable>
						Estamos processando o contrato
					</Button>
				)}
			</div>

			{document && (
				<ContractSignedDocument
					modal={modal}
					setModal={setModal}
					documentContract={document}
					cnpj={cpnj}
					closeAfterSave={closeAfterSave}
				/>
			)}
		</div>
	);
}
