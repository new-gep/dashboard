import React, { useContext } from 'react';
import classNames from 'classnames';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import Mask from '../../../function/Mask';
const DashboardBookingHeader = () => {
	const { userData } = useContext(AuthContext);
	const { darkModeStatus } = useDarkMode();
	
	return (
		<Header>
			<HeaderLeft>
				<div className='d-flex align-items-center'>
					<div className='row g-4'>
						<div className='col-md-auto'>
							<div
								className={classNames('fs-3', 'fw-bold', {
									'text-dark': !darkModeStatus,
								})}>
								Oi, <span className='text-capitalize'>{userData.name && Mask('firstName',userData.name)}</span>!
							</div>
						</div>
					</div>
				</div>
			</HeaderLeft>
			<HeaderRight>
				<CommonHeaderChat />
			</HeaderRight>
		</Header>
	);
};

export default DashboardBookingHeader;
