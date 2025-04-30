import React, { FC, useContext, useEffect, useState } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../../components/bootstrap/Card';

import Icon from '../../../../../components/icon/Icon';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../../../components/PaginationButtons';
import useDarkMode from '../../../../../hooks/useDarkMode';
import Job_Open from '../../../../../api/get/job/Job_Open';
import AuthContext from '../../../../../contexts/authContext';
import { AbstractPicture } from '../../../../../constants/abstract';
import { priceFormat } from '../../../../../helpers/helpers';
import Mask from '../../../../../function/Mask';
import Button from '../../../../../components/bootstrap/Button';
import { useNavigate } from 'react-router-dom';

type AbstractPictureKeys = keyof typeof AbstractPicture;
interface ITableRowProps {
	id: number;
	image: AbstractPictureKeys;
	function: string;
	salary: string;
	contract: string;
	candidates: any;
	locality:any
}
const TableRow: FC<ITableRowProps> = ({
	id,
	image,
	function: functionTitle,
	salary,
	contract,
	candidates,
	locality
}) => {
	const { darkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	


	return (
		<tr>
			<th scope='row'>{id}</th>
			<td>
				<img src={AbstractPicture[image]} alt='' width={54} height={54} />
			</td>
			<td>
				<div className='text-capitalize'>{functionTitle}</div>
			</td>
			<td>{Mask('amount',salary)}</td>
			<td>
				<span
					className={`${contract == 'contract' ? 'text-capitalize' : 'text-uppercase'}`}>
					{contract == 'contract' ? 'contrato' : contract}
				</span>
			</td>
			<td>
				<span>{locality && locality}</span>
			</td>
			<td>
				<span>{candidates ? candidates.length : 0}</span>
			</td>
			<td className='h5'><Button isLink color='light' icon='ArrowForward' onClick={()=>navigate(`/sales/Job/${id}`)} /></td> 
		</tr>
	);
};

const CommonDashboardJob = () => {
	const { userData } = useContext(AuthContext);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['3']);
	const [jobs, setJobs] = useState<null | any>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (userData && userData.cnpj) {
				const response = await Job_Open(userData.cnpj);
				if (!response || response.status !== 200) {
					setJobs([]);
					return;
				}
				switch (response.status) {
					case 200:
						setJobs(response.job);
						break;

					default:
						break;
				}
			}
		};
		fetchData();
	}, [userData]);

	return (
		<>
			{jobs && (
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
										{/* <Icon
											size='lg'
											// className={}
											icon='FilterList'
										/> */}
									</th>
									<th scope='col'>Imagem</th>
									<th
										scope='col'
										// onClick={}
										className='cursor-pointer '>
										Função{' '}
										{/* <Icon
											size='lg'
											// className={}
											icon='FilterList'
										/> */}
									</th>
									<th scope='col'>Salario</th>
									<th
										scope='col'
										// onClick={() => requestSort('price')}
										className='cursor-pointer '>
										Contratação{' '}
									</th>
									<th
										scope='col'
										// onClick={() => requestSort('price')}
										className='cursor-pointer '>
										Local{' '}
									</th>
									<th
										scope='col'
										// onClick={() => requestSort('store')}
										className='cursor-pointer '>
										Candidatos{' '}
										{/* <Icon
											size='lg'
											// className={}
											icon='FilterList'
										/> */}
									</th>
									<th
										scope='col'
										// onClick={() => requestSort('store')}
										className='cursor-pointer '>
										{/* <Icon
											size='lg'
											// className={}
											icon='FilterList'
										/> */}
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
			)}
		</>
	);
};

export default CommonDashboardJob;
