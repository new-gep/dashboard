import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderRight from './CommonHeaderRight';


const ProductListHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				LOGO EMPRESA 
			</HeaderLeft>
			<CommonHeaderRight />
		</Header>
	);
};

export default ProductListHeader;
