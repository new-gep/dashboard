import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContact from '../../../../../components/UserContact';
import MasterAdmin from '../../../../../api/get/user/MasterAdmin';
import AuthContext from '../../../../../contexts/authContext';
import Mask from '../../../../../function/Mask';

const CommonDashboardUserCard = () => {
	const navigate = useNavigate();
	const { userData } = useContext(AuthContext);
	const [masterAdmin, setMasterAdmin] = useState<any>(null);

	useEffect(() => {
		if (userData) {
			MasterAdmin(userData.cnpj).then((res) => {
				console.log('res', res);
				if (!res || res.status !== 200) {
					setMasterAdmin(null);
					return;
				}
				if (res && res.status === 200) {
					setMasterAdmin(res.user);
				}
			});
		}
	}, [userData]);

	return (
		<>
			{masterAdmin ? (
				<UserContact
					name={`${Mask('firstName', masterAdmin.name)} ${Mask('secondName', masterAdmin.name)}`}
					position='Responsável'
					mail={`${masterAdmin.email}`}
					phone={`55${masterAdmin.phone}`}
					// onChat={() => navigate(`../${demoPagesMenu.chat.subMenu.withListChat.path}`)}
					src={masterAdmin.avatar}
				/>
			) : (
				<></>
			)}
		</>
	);
};

export default CommonDashboardUserCard;
