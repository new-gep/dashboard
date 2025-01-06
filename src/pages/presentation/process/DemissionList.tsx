import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import { mainMenu } from '../../../menu';
import DemissionTable from '../../_common/Process/DemissionTable';
import useDarkMode from '../../../hooks/useDarkMode';
import Job_Admissional from '../../../api/get/job/Job_Admissional';
import AuthContext from '../../../contexts/authContext';

const AppointmentList = () => {
	const { themeStatus } = useDarkMode();
	const { userData } = useContext(AuthContext);
	const [count, setCount] = useState<any>(null)
	const [laoder, setLoader] = useState<boolean>(false)
	
	const fetchData = async () => {
		const response = await Job_Admissional(userData.cnpj)
		if(response.status == 200){
			setCount(response.counts)
			setLoader(true)
		}
	}

	useEffect(()=>{
		fetchData()
	},[userData])

	return (
		<PageWrapper title={mainMenu.process.subMenu.admission.text} >
			<SubHeader>
				<SubHeaderLeft>
					{laoder &&
						<div className='d-flex gap-2 p-3'>
						<div className="d-flex flex-column align-items-center justify-content-center">
							<Icon icon='looksOne' size='2x' />
							<span className='text-muted'>{count && count.step1 ? count.step2 : '0'}</span>
						</div>
						<Icon icon='Maximize' className='mt-3' size='2x' /> 
						<div className="d-flex flex-column align-items-center justify-content-center ">
							<Icon icon='looksTwo'  size='2x' />
							<span className='text-muted'>{count && count.step2 ? count.step2 : '0'}</span>
						</div>
						<Icon icon='Maximize' className='mt-3' size='2x' /> 
						<div className="d-flex flex-column align-items-center justify-content-center ">
							<Icon icon='looks3'  size='2x' />
							<span className='text-muted'>{count && count.step3 ? count.step3 : '0'}</span>
						</div>
						{/* <Icon icon='Maximize' className='me-2 mt-4' size='2x' />
						<Icon icon='looksTwo' className='me-2' size='2x' />
						<Icon icon='Maximize' className='me-2 mt-4' size='2x' />
						<Icon icon='looks3' className='me-2' size='2x' /> */}
						</div>
					}
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
						<DemissionTable isFluid />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AppointmentList;
