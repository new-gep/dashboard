import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importando a localização em português
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import { mainMenu } from '../../../menu';
import DemissionTable from '../../_common/Process/DemissionTable';
import useDarkMode from '../../../hooks/useDarkMode';
import Job_Demissional from '../../../api/get/job/Job_Demissional';
import AuthContext from '../../../contexts/authContext';
import PointTable from '../../_common/Process/PointTable';
import Popovers from '../../../components/bootstrap/Popovers';
import { Calendar as DatePicker } from 'react-date-range';
import { Calendar, dayjsLocalizer, View as TView, Views } from 'react-big-calendar';
import { getLabel } from '../../../components/extras/calendarHelper';

const AppointmentList = () => {
	const { themeStatus } = useDarkMode();
	const { userData } = useContext(AuthContext);
	const [count, setCount] = useState<any>(null)
	const [laoder, setLoader] = useState<boolean>(false)
	const [date, setDate] = useState(new Date());
	const [selectedMonth, setSelectedMonth] = useState<{ monthEN: string, month: string, year: number }>({
		monthEN: dayjs().locale('en').format('MMMM'),
		month: dayjs().locale('pt-br').format('MMMM'),
		year: dayjs().year()
	});
    const [viewMode, setViewMode] = useState<TView>(Views.MONTH);
    const calendarDateLabel = getLabel(date, viewMode);
    
	const fetchData = async () => {
		const response = await Job_Demissional(userData.cnpj)
		if(response.status == 200){
			setCount(response.counts)
			setLoader(true)
		}
	}

	useEffect(()=>{
		fetchData()
	},[userData])

	return (
		<PageWrapper title={mainMenu.process.subMenu.point.text} >
			<SubHeader>
				<SubHeaderLeft>
					<Icon icon='Info' className='me-2' size='2x' />
					<span className='text-muted'>
					    Mantenha-se organizado e nunca perca um compromisso com nosso sistema intuitivo e fácil de usar.
					</span>
				</SubHeaderLeft>
                
				<SubHeaderRight>
					<div className="month-navigator">
						<Button
							color="light"
							isLink
							onClick={() => {
								const prevMonth = dayjs(date).subtract(1, 'month');
								const selectedMonthName = prevMonth.locale('pt-br').format('MMMM');
								setDate(prevMonth.toDate());
								setSelectedMonth({
									monthEN: prevMonth.locale('en').format('MMMM'),
									month: selectedMonthName.charAt(0).toUpperCase() + selectedMonthName.slice(1),
									year: prevMonth.year()
								});
							}}
						>
							Anterior
						</Button>
						<span className="mx-2">
							{selectedMonth.month} {selectedMonth.year}
						</span>
						<Button
							color="light"
							isLink
							onClick={() => {
								const nextMonth = dayjs(date).add(1, 'month');
								const selectedMonthName = nextMonth.locale('pt-br').format('MMMM');
								setDate(nextMonth.toDate());
								setSelectedMonth({
									monthEN: nextMonth.locale('en').format('MMMM'),
									month: selectedMonthName.charAt(0).toUpperCase() + selectedMonthName.slice(1),
									year: nextMonth.year()
								});
							}}
						>
							Próximo
						</Button>
					</div>
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-12'>
						<PointTable selectedMonth={selectedMonth} />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AppointmentList;
