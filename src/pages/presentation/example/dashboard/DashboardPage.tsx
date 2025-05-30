import React, { useContext, useState } from 'react';
import { useTour } from '@reactour/tour';
import useDarkMode from '../../../../hooks/useDarkMode';
import { demoPagesMenu } from '../../../../menu';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';

import Page from '../../../../layout/Page/Page';
import { TABS, TTabs } from './common/helper';

import CommonDashboardAlert from './common/CommonDashboardAlert';
import CommonDashboardUserCard from './common/CommonDashboardUserCard';
import CommonDashboardDesignTeam from './common/CommonDashboardDesignTeam';
import CommonMyWallet from '../../../_common/CommonMyWallet';
import CommonDashboardJob from './common/CommonDashboardJob';
import ThemeContext from '../../../../contexts/themeContext';

const DashboardPage = () => {
	const { mobileDesign } = useContext(ThemeContext);
	/**
	 * Tour Start
	 */
	const { setIsOpen } = useTour();
	// useEffect(() => {
	// 	if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
	// 		setTimeout(() => {
	// 			setIsOpen(true);
	// 			localStorage.setItem('tourModalStarted', 'shown');
	// 		}, 7000);
	// 	}
	// 	return () => {};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const { themeStatus } = useDarkMode();

	const [activeTab, setActiveTab] = useState<TTabs>(TABS.YEARLY);

	return (
		<>
			{/* <LockSystem /> */}
			<PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
				{/* <SubHeader>
				<SubHeaderLeft>
					<span className='h4 mb-0 fw-bold'>Overview</span>
					<SubheaderSeparator />
					<ButtonGroup>
						{Object.keys(TABS).map((key) => (
							<Button
								key={key}
								color={activeTab === TABS[key] ? 'success' : themeStatus}
								onClick={() => setActiveTab(TABS[key])}>
								{TABS[key]}
							</Button>
						))}
					</ButtonGroup>
				</SubHeaderLeft>
				<SubHeaderRight>
					<CommonAvatarTeam>
						<strong></strong> Team
					</CommonAvatarTeam>
				</SubHeaderRight>
			</SubHeader> */}
				<Page container='fluid'>
					<div className='row'>
						<div className='col-12'>
							<CommonDashboardAlert />
						</div>

						<div className='col-xl-4'>
							<CommonDashboardUserCard />
						</div>
						{/* <div className='col-xl-4'>
						<CommonDashboardClientTeam />
					</div> */}
						<div className='col-xl-8'>
							<CommonDashboardDesignTeam />
						</div>

						{/* <div className='col-xxl-6'>
						<CommonDashboardIncome activeTab={activeTab} />
					</div>
					<div className='col-xxl-3'>
						<CommonDashboardRecentActivities />
					</div>
					<div className='col-xxl-3'>
						<CommonDashboardUserIssue />
					</div> 

					<div className='col-xxl-8'>
						<CommonDashboardSalesByStore />
					</div> 
					
					<div className='col-xxl-4 col-xl-6'>
						<CommonDashboardWaitingAnswer />
					</div> */}

						<div className='col-xxl-4 col-xl-6'>
							<CommonMyWallet />
						</div>
						<div className='col-xxl-8'>
							<CommonDashboardJob />
						</div>
					</div>
				</Page>
			</PageWrapper>
		</>
	);
};

export default DashboardPage;
