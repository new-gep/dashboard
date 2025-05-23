import React from 'react';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Page from '../../../../layout/Page/Page';
import Humans from '../../../../assets/img/scene3.png';
import HumansWebp from '../../../../assets/img/scene3.webp';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import CommonLayoutRightSubheader from '../../../_layout/_subheaders/CommonLayoutRightSubheader';
import { pageLayoutTypesPagesMenu } from '../../../../menu';

const OnlySubheader = () => {
	return (
		<PageWrapper title={pageLayoutTypesPagesMenu.pageLayout.subMenu.onlySubheader.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{ title: 'Page Layout', to: '/page-layouts' },
							{
								title: 'Only Subheader',
								to: '/page-layouts/only-subheader',
							},
						]}
					/>
				</SubHeaderLeft>
				<CommonLayoutRightSubheader />
			</SubHeader>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p>
							<span className='text-primary fw-bold me-1'>Only</span> Subheader
						</p>
					</div>
					<div className='col-12 d-flex align-items-baseline justify-content-center'>
						<img
							srcSet={HumansWebp}
							src={Humans}
							alt='Humans'
							style={{ height: '50vh', transform: 'translateX(-5vw)' }}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlySubheader;
