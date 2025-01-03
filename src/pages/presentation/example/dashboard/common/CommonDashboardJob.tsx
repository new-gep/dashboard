import React, { FC, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ApexOptions } from 'apexcharts';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../components/bootstrap/Dropdown';
import Button from '../../../../../components/bootstrap/Button';
import Icon from '../../../../../components/icon/Icon';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../../../components/PaginationButtons';
import data from '../../../../../common/data/dummyProductData';
import useSortableData from '../../../../../hooks/useSortableData';
import useDarkMode from '../../../../../hooks/useDarkMode';
import { demoPagesMenu } from '../../../../../menu';
import Chart from '../../../../../components/extras/Chart';
import Badge from '../../../../../components/bootstrap/Badge';
import Job_Open from '../../../../../api/get/Job/Job_Open';
import AuthContext from '../../../../../contexts/authContext';
import { AbstractPicture } from '../../../../../constants/abstract';
import Mask from '../../../../../function/Mask';
import { priceFormat } from '../../../../../helpers/helpers'; 
type AbstractPictureKeys = keyof typeof AbstractPicture;
interface ITableRowProps {
	id      : number;
	image   : AbstractPictureKeys;
	function: string;
	salary  : string;
	contract: string
	candidates:any;
}
const TableRow: FC<ITableRowProps> = ({
	id,     
	image,
	function: functionTitle,
	salary ,
	contract,
	candidates
}) => {
	const { darkModeStatus } = useDarkMode();

	return (
		<tr>
			<th scope='row'>{id}</th>
			<td>
				<img src={AbstractPicture[image]} alt='' width={54} height={54} />
			</td>
			<td>
				<div>
					{functionTitle}
				</div>
			</td>
			<td >
				R$ {priceFormat(salary)}
			</td>
			<td>
				<span className={`${contract == 'contract' ? 'text-capitalize' : 'text-uppercase'}`}>
					{contract == 'contract' ? 'contrato' : contract}
				</span>
			</td>
			<td>
				<span>
					{candidates ? candidates.length : 0}
				</span>
			</td>
			<td className='h5'>

			</td>
		</tr>
	);
};

const CommonDashboardJob = () => {
	const { userData } = useContext(AuthContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['3']);
	const [jobs, setJobs] = useState<null | any>(null);

	useEffect(()=>{
		const fetchData = async () => {
			if(userData){
				const response  = await Job_Open(userData.cnpj);
				switch (response.status) {
					case 200:
						setJobs(response.job)
						break;
				
					default:
						break;
				}
			}
		}
		fetchData()
	},[userData])

	return (
		<>
			{jobs &&
				<Card stretch>
					<CardHeader>
						<CardLabel icon='Work' iconColor='info'>
							<CardTitle tag='div' className='h5'>
								Vagas Abertas
							</CardTitle>
						</CardLabel>
						{/* <CardActions>
							<Dropdown isButtonGroup>
								<Button color='success' isLight icon='WaterfallChart'>
									{(topSellerFilter === TOP_SELLER_FILTER.DAY &&
										dayjs().format('MMM Do')) ||
										(topSellerFilter === TOP_SELLER_FILTER.WEEK &&
											`${dayjs().startOf('week').format('MMM Do')} - ${dayjs()
												.endOf('week')
												.format('MMM Do')}`) ||
										(topSellerFilter === TOP_SELLER_FILTER.MONTH &&
											dayjs().format('MMM YYYY'))}
								</Button>
								<DropdownToggle>
									<Button color='success' isLight isVisuallyHidden />
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<Button onClick={() => setTopSellerFilter(TOP_SELLER_FILTER.DAY)}>
											Last Day
										</Button>
									</DropdownItem>
									<DropdownItem>
										<Button onClick={() => setTopSellerFilter(TOP_SELLER_FILTER.WEEK)}>
											Last Week
										</Button>
									</DropdownItem>
									<DropdownItem>
										<Button onClick={() => setTopSellerFilter(TOP_SELLER_FILTER.MONTH)}>
											Last Month
										</Button>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<Button
								color='info'
								icon='CloudDownload'
								isLight
								tag='a'
								to='/somefile.txt'
								target='_blank'
								download>
								Export
							</Button>
						</CardActions> */}
					</CardHeader>
						
					<CardBody className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th
										scope='col'
										// onClick={}
										className='cursor-pointer text-decoration-underline'>
										#{' '}
										<Icon
											size='lg'
											// className={}
											icon='FilterList'
										/>
									</th>
									<th scope='col'>Imagem</th>
									<th
										scope='col'
										// onClick={}
										className='cursor-pointer text-decoration-underline'>
										Função{' '}
										<Icon
											size='lg'
											// className={}
											icon='FilterList'
										/>
									</th>
									<th scope='col'>Salario</th>
									<th
										scope='col'
										// onClick={() => requestSort('price')}
										className='cursor-pointer text-decoration-underline'>
										Contratação{' '}
										<Icon
											size='lg'
											// className={getClassNamesFor('price')}
											icon='FilterList'
										/>
									</th>
									<th
										scope='col'
										// onClick={() => requestSort('store')}
										className='cursor-pointer text-decoration-underline'>
										Candidatos{' '}
										<Icon
											size='lg'
											// className={}
											icon='FilterList'
										/>
									</th>
								</tr>
							</thead>
							
							<tbody>
							
								{dataPagination(jobs, currentPage, perPage).map((i) => (
									// eslint-disable-next-line react/jsx-props-no-spreading
									<TableRow key={i.id} {...i} />
								))}
							
							</tbody>
						</table>
					</CardBody>
					<PaginationButtons
						data={jobs}
						label='items'
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						perPage={perPage}
						setPerPage={setPerPage}
					/>
				</Card>
			}
		</>
	);
};

export default CommonDashboardJob;
