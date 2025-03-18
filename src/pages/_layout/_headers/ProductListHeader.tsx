import React, { useContext, useEffect, useState } from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderRight from './CommonHeaderRight';
import Avatar from '../../../components/Avatar';
import AuthContext from '../../../contexts/authContext';
import GetCompanyFindOne from '../../../api/get/company/FindOne';
import CompanyLogoDefault from '../../../assets/img/companyLogoDefault.png';

const ProductListHeader = () => {

	const { userData } = useContext(AuthContext);
	const [logoPath, setLogoPath] = useState<null | string>(null);
	const [companyDates, setCompanyDates] = useState<null | any>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (userData) {
				const response = await GetCompanyFindOne(userData.cnpj);
				if (response.status == 200) {
					setLogoPath(response.logo);
					setCompanyDates(response.company);
				}
			}
		};
		fetchData();
	}, [userData]);	return (
		<Header>
			<HeaderLeft>
				{logoPath ? (
						<Avatar src={logoPath} size={32} />
					) : (
						<Avatar src={CompanyLogoDefault} size={32} />
					)}
					{companyDates && (
						<span>
							<strong>{companyDates.company_name}</strong>
						</span>
					)}
					<span className='text-muted'>Company</span> 
			</HeaderLeft>
			<CommonHeaderRight />
		</Header>
	);
};

export default ProductListHeader;
