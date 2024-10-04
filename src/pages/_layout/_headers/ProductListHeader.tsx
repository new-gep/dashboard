import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderRight from './CommonHeaderRight';
import Company1 from '../../../assets/logos/company1.png';

const ProductListHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				LOGO EMPRESA 
				<span>Vagas</span>
			</HeaderLeft>
			<CommonHeaderRight />
		</Header>
	);
};

export default ProductListHeader;
