import React, { FC } from 'react';
import { ApexOptions } from 'apexcharts';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Chart from '../../components/extras/Chart';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Badge from '../../components/bootstrap/Badge';
import { priceFormat } from '../../helpers/helpers';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import { demoPagesMenu } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';

interface ICommonGridJobItemProps {
	id: string | number;
	name: string;
	category: string;
	img: string;
	color: string;
	series: ApexOptions['series'];
	price: number;
	editAction: any;
	deleteAction: any;
}
const CommonGridJobItem: FC<ICommonGridJobItemProps> = ({
	id,
	name,
	category,
	img,
	color,
	series,
	price,
	editAction,
	deleteAction,
}) => {
	const { themeStatus, darkModeStatus } = useDarkMode();

	const dummyOptions: ApexOptions = {
		colors: [color],
		chart: {
			type: 'line',
			width: 100,
			height: 35,
			sparkline: {
				enabled: true,
			},
		},
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: false,
			},
			x: {
				show: false,
			},
			y: {
				title: {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					formatter(seriesName: string) {
						return '';
					},
				},
			},
		},
		stroke: {
			curve: 'smooth',
			width: 2,
		},
	};
	return (
		<Card>
			<CardHeader>
				<CardLabel>
					<CardTitle tag='div' className='h5'>
						{name}{' '}
					</CardTitle>
					<CardSubTitle tag='div' className='h6'>
						{category}
					</CardSubTitle>
				</CardLabel>
				<CardActions>
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button
								icon='MoreHoriz'
								color={themeStatus}
								shadow='default'
								aria-label='Edit'
							/>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd>
							<DropdownItem>
								<Button icon='Edit' onClick={() => editAction()}>
									Edit
								</Button>
							</DropdownItem>
							<DropdownItem isDivider />
							<DropdownItem>
								<Button icon='Delete' onClick={() => deleteAction()}>
									Delete
								</Button>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</CardActions>
			</CardHeader>
			<CardBody>
				<img
					src={img}
					alt=''
					width={128}
					height={128}
					className='mx-auto d-block img-fluid mb-3'
				/>
				<div className='row align-items-center'>
					<div className='col'>Candidatos</div>
					<div className='col-auto'>
						<p className='fw-bold fs-3 mb-0 text-success'>50</p>
					</div>
				</div>
			</CardBody>
			<CardFooter className='shadow-3d-container'>
				<Button
					color='dark'
					className={`w-100 mb-4 shadow-3d-up-hover shadow-3d-${
						darkModeStatus ? 'light' : 'dark'
					}`}
					size='lg'
					tag='a'
					to={`../${demoPagesMenu.sales.subMenu.productID.path}/${id}`}>
					Ver Vaga
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CommonGridJobItem;
