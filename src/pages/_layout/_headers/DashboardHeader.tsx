import React from 'react';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import CommonHeaderRight from './CommonHeaderRight';

const DashboardHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				{/* <Search /> */}
				<></>
			</HeaderLeft>
			<HeaderRight>
				<CommonHeaderRight afterChildren={<CommonHeaderChat />} />
			</HeaderRight>
		</Header>
	);
};

export default DashboardHeader;
