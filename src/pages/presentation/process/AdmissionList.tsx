import React from 'react';
import dayjs from 'dayjs';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import { mainMenu } from '../../../menu';
import AdmissionTable from '../../_common/Process/AdmissionTable';
import useDarkMode from '../../../hooks/useDarkMode';

const AppointmentList = () => {
	const { themeStatus } = useDarkMode();


	return (
		<PageWrapper title={mainMenu.process.subMenu.admission.text} >
			<SubHeader>
				<SubHeaderLeft>
					<div className='d-flex gap-2 p-3'>
						<div className="d-flex flex-column align-items-center justify-content-center">
							<Icon icon='looksOne' size='2x' />
							<span className='text-muted'>1</span>
						</div>
						<Icon icon='Maximize' className='mt-3' size='2x' /> 
						<div className="d-flex flex-column align-items-center justify-content-center ">
							<Icon icon='looksTwo'  size='2x' />
							<span className='text-muted'>0</span>
						</div>
						<Icon icon='Maximize' className='mt-3' size='2x' /> 
						<div className="d-flex flex-column align-items-center justify-content-center ">
							<Icon icon='looks3'  size='2x' />
							<span className='text-muted'>0</span>
						</div>
						{/* <Icon icon='Maximize' className='me-2 mt-4' size='2x' />
						<Icon icon='looksTwo' className='me-2' size='2x' />
						<Icon icon='Maximize' className='me-2 mt-4' size='2x' />
						<Icon icon='looks3' className='me-2' size='2x' /> */}
					</div>
					{/* <span className='text-muted'>
						You have <Icon icon='looksTwo' color='success' className='mx-1' size='lg' />{' '}
						3 approved appointments and{' '}
						<Icon icon='looks3' color='warning' className='mx-1' size='lg' /> 4 pending
						appointments for today.
					</span> */}
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button color={themeStatus}>
						{dayjs().format('MMM Do')} - {dayjs().add(7, 'days').format('MMM Do')}
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-12'>
						<AdmissionTable isFluid />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AppointmentList;
