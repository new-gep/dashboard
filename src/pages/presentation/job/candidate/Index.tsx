import * as React from 'react';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubheaderSeparator,
} from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import { mainMenu } from '../../../../menu';
import AuthContext from '../../../../contexts/authContext';
import Mask from '../../../../function/Mask';
import classNames from 'classnames';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import Page from '../../../../layout/Page/Page';
import Button from '../../../../components/bootstrap/Button';
import CollaboratorAll from '../../../../api/get/collaborator/All';

export default function SearchCandidate() {
	const { userData } = React.useContext(AuthContext);
	const [filterMenu, setFilterMenu] = React.useState(false);
	const [loader, setLoader] = React.useState<boolean>(true);
	const [collaboratorCompany, setCollaboratorCompany] = React.useState<any>(null);

	React.useEffect(() => {
		const fetchData = async () => {
			const response = await CollaboratorAll();
			if (!response || response.status !== 200) {
				setLoader(false);
				return;
			}
			setCollaboratorCompany(response.candidates);
			setTimeout(() => {
				setLoader(false);
			}, 2000);
		};
		if (userData) {
			fetchData();
		}
	}, [userData]);

	return (
		<PageWrapper>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						homePath='/recruit/home'
						list={[
							{
								to: mainMenu.recruit.subMenu.job.path,
								title: 'Buscar Candidato',
							},
						]}
					/>
					<SubheaderSeparator />
				</SubHeaderLeft>
			</SubHeader>
			<section>
				{loader ? (
					<div className='p-5'>
						<h1>🔍 Buscando Candidatos</h1>
					</div>
				) : (
					<Page container='fluid'>
						<div className='row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2'>
							{Array.isArray(collaboratorCompany) &&
							collaboratorCompany.length > 0 ? (
								collaboratorCompany.map((job) => {
									console.log('teste', job);
									if (!job || !job.CPF) {
										return;
									}
									return (
										<div key={job.CPF} className='col'>
											<Card key={job.CPF}>
												<CardBody key={job.CPF}>
													<div className='row g-3'>
														<div className='col d-flex'>
															<div className='flex-shrink-0'>
																<div className='position-relative'>
																	<div
																		className='ratio ratio-1x1'
																		style={{ width: 100 }}>
																		<div
																			className={classNames(
																				// `bg-l25-${user.color}`,
																				'rounded-2',
																				'd-flex align-items-center justify-content-center',
																				'overflow-hidden',
																				'shadow',
																			)}>
																			<img
																				src={
																					job &&
																					job.picture
																						.base64Data
																				}
																				alt={job.name}
																				width={100}
																			/>
																		</div>
																	</div>
																</div>
															</div>
															<div className='flex-grow-1 ms-3 d-flex justify-content-between'>
																<div className='w-100'>
																	<div className='row'>
																		<div className='col'>
																			<div className='d-flex flex-column gap-3 align-items-start'>
																				<div className='fw-bold fs-5 me-2'>
																					{/* {`${user.name} ${user.surname}`} */}
																					{Mask(
																						'firstName',
																						job.name,
																					)}{' '}
																					{Mask(
																						'secondName',
																						job.name,
																					)}
																				</div>
																			</div>

																			<div className='text-muted'>
																				{/* @{job.function} */}
																			</div>
																		</div>
																		<div className='col-auto'>
																			<Button
																				icon='Info'
																				color='dark'
																				isLight
																				hoverShadow='sm'
																				tag='a'
																				to={`../candidate/profile/${job.CPF}`}
																				// data-tour={user.name}
																				aria-label='More info'
																			/>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</CardBody>
											</Card>
										</div>
									);
								})
							) : (
								<div className='p-5 w-full'>
									<h1>Nenhum colaborador encontrado</h1>
								</div>
							)}
						</div>
					</Page>
				)}
			</section>
		</PageWrapper>
	);
}
