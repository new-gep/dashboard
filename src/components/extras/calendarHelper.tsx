import PropTypes from 'prop-types';
import { Views } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { FC } from 'react';
import Button, { ButtonGroup } from '../bootstrap/Button';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown';

dayjs.locale('pt-br');

export const getUnitType = (viewMode: 'month' | 'week' | 'work_week' | 'day' | 'agenda') => {
	let unitType = null;
	switch (viewMode) {
		case Views.WEEK:
		case Views.WORK_WEEK:
			unitType = Views.WEEK;
			break;
		case Views.MONTH:
		case Views.AGENDA:
			unitType = Views.MONTH;
			break;
		default:
			unitType = Views.DAY;
	}
	return unitType;
};

export const getLabel = (
	date: dayjs.ConfigType,
	viewMode: 'month' | 'week' | 'work_week' | 'day' | 'agenda',
) => {
	if (viewMode === Views.MONTH) return dayjs(date).format('MMMM YYYY');
	if (viewMode === Views.WEEK)
		return `${dayjs(date).startOf('week').format('MMM D')} - ${dayjs(date)
			.endOf('week')
			.format('MMM D')}`;
	if (viewMode === Views.WORK_WEEK)
		return `${dayjs(date).startOf('week').add(1, 'day').format('MMM D')} - ${dayjs(date)
			.endOf('week')
			.add(-1, 'day')
			.format('MMM D')}`;
	if (viewMode === Views.AGENDA)
		return `${dayjs(date).format('L')} - ${dayjs(date).add(1, 'month').format('L')}`;
	return dayjs(date).format('dddd, MMM D');
};

export const getTodayButtonLabel = (
	viewMode: 'month' | 'week' | 'work_week' | 'day' | 'agenda',
) => {
	if (viewMode === Views.MONTH || viewMode === Views.AGENDA) return 'Este mês';
	if (viewMode === Views.WEEK || viewMode === Views.WORK_WEEK) return 'Esta semana';
	return 'Hoje';
};

export const getViews = () => {
	// @ts-ignore
	return Object.keys(Views).map((k) => Views[k]);
};

interface ICalendarTodayButtonProps {
	setDate(...args: unknown[]): unknown;
	date: object;
	unitType: string;
	viewMode: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
}
export const CalendarTodayButton: FC<ICalendarTodayButtonProps> = ({
	setDate,
	date,
	unitType,
	viewMode,
}) => {
	return (
		<ButtonGroup>
			<Button
				color='info'
				isLight
				// @ts-ignore
				onClick={() => setDate(dayjs(date).add(-1, unitType).toDate())}
				icon='ChevronLeft'
				aria-label='Anterior'
			/>
			{/* @ts-ignore */}
			<Button color='info' isLight onClick={() => setDate(dayjs().toDate())}>
				{getTodayButtonLabel(viewMode)}
			</Button>
			<Button
				color='info'
				isLight
				// @ts-ignore
				onClick={() => setDate(dayjs(date).add(1, unitType).toDate())}
				icon='ChevronRight'
				aria-label='Próximo'
			/>
		</ButtonGroup>
	);
};

CalendarTodayButton.propTypes = {
	setDate: PropTypes.func.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	date: PropTypes.object.isRequired,
	unitType: PropTypes.string.isRequired,
	// @ts-ignore
	viewMode: PropTypes.oneOf(['month', 'week', 'work_week', 'day', 'agenda']).isRequired,
};

interface ICalendarViewModeButtonsProps {
	viewMode: 'month' | 'week' | 'work_week' | 'day' | 'agenda';
	setViewMode(...args: unknown[]): unknown;
}
export const CalendarViewModeButtons: FC<ICalendarViewModeButtonsProps> = ({
	viewMode,
	setViewMode,
}) => {
	return (
		<Dropdown>
			<DropdownToggle>
				<Button
					color='primary'
					isLight
					icon={
						(viewMode === Views.MONTH && 'calendar_view_month') ||
						(viewMode === Views.WEEK && 'calendar_view_week') ||
						(viewMode === Views.WORK_WEEK && 'view_week') ||
						(viewMode === Views.DAY && 'calendar_view_day') ||
						'view_agenda'
					}>
					{(viewMode === Views.MONTH && 'Mês') ||
						(viewMode === Views.WEEK && 'Semana') ||
						(viewMode === Views.WORK_WEEK && 'Semana de Trabalho') ||
						(viewMode === Views.DAY && 'Dia') ||
						'Agenda'}
				</Button>
			</DropdownToggle>
			<DropdownMenu isAlignmentEnd>
				<DropdownItem>
					<Button
						color='link'
						icon='calendar_view_month'
						isActive={viewMode === Views.MONTH}
						onClick={() => setViewMode(Views.MONTH)}>
						Mês
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						color='link'
						icon='calendar_view_week'
						isActive={viewMode === Views.WEEK}
						onClick={() => setViewMode(Views.WEEK)}>
						Semana
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						color='link'
						icon='view_week'
						isActive={viewMode === Views.WORK_WEEK}
						onClick={() => setViewMode(Views.WORK_WEEK)}>
						Semana de Trabalho
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						color='link'
						icon='calendar_view_day'
						isActive={viewMode === Views.DAY}
						onClick={() => setViewMode(Views.DAY)}>
						Dia
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						color='link'
						icon='view_agenda'
						isActive={viewMode === Views.AGENDA}
						onClick={() => setViewMode(Views.AGENDA)}>
						Agenda
					</Button>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
CalendarViewModeButtons.propTypes = {
	// @ts-ignore
	viewMode: PropTypes.oneOf(['month', 'week', 'work_week', 'day', 'agenda']).isRequired,
	setViewMode: PropTypes.func.isRequired,
};
