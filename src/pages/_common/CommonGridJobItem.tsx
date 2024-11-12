import React, { FC, useEffect } from 'react';
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
import { AbstractPicture } from '../../constants/abstract';

type AbstractPictureKeys = keyof typeof AbstractPicture;
interface ICommonGridJobItemProps {
	id: any;
	image:AbstractPictureKeys;
	title_job:string;
	candidates:any
	editAction: any;
	deleteAction: any;
}
const CommonGridJobItem: FC<ICommonGridJobItemProps> = ({
	id,
	image,
	title_job,
	editAction,
	deleteAction,
	candidates
}) => {
	const { themeStatus, darkModeStatus } = useDarkMode();


	return (
		<Card>
			<CardHeader>
				<CardLabel>
					<CardTitle tag='div' className='h5'>
						{title_job}{' '}
					</CardTitle>
					<CardSubTitle tag='div' className='h6'>
						#{id}
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
									Editar
								</Button>
							</DropdownItem>
							<DropdownItem isDivider />
							<DropdownItem>
								<Button icon='Delete' onClick={() => deleteAction()}>
									Deletar
								</Button>
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</CardActions>
			</CardHeader>
			<CardBody>
				<img
					src={AbstractPicture[image]}
					alt=''
					width={128}
					height={128}
					className='mx-auto d-block img-fluid mb-3'
				/>
				<div className='row align-items-center'>
					<div className='col'>Candidatos</div>
					<div className='col-auto'>
						<p className='fw-bold fs-3 mb-0 text-success'> {candidates && candidates.length ? candidates.length : '0'}</p>
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
					to={`../${demoPagesMenu.sales.subMenu.jobID.path}/${id}`}>
					Ver Vaga
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CommonGridJobItem;
