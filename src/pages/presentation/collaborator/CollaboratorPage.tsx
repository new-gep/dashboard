import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import SubHeader, { SubHeaderLeft } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import AuthContext from '../../../contexts/authContext';
import JobCollaboratorCompany from '../../../api/get/job/Job_Collaborator_Company';
import Mask from '../../../function/Mask';

const CollaboratorList = () => {
    const { userData } = useContext(AuthContext);
    const [collaboratorCompany, setCollaboratorCompany] = useState<any>([]);
    const [filteredCollaborators, setFilteredCollaborators] = useState<any>([]);
    const [loader, setLoader] = useState<boolean>(true);

    const formik = useFormik({
        initialValues: {
            searchInput: '',
        },
        onSubmit: () => {},
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await JobCollaboratorCompany(userData.cnpj);
            if (!response || response.status !== 200) {
                setLoader(false);
                return;
            }
            setCollaboratorCompany(response.collaborator);
            setFilteredCollaborators(response.collaborator); // Inicializa com todos os colaboradores
            setLoader(false);
        };
        if (userData) {
            fetchData();
        }
    }, [userData]);

    // Filtra os colaboradores com base no valor do campo de busca
    useEffect(() => {
        const searchValue = formik.values.searchInput.toLowerCase();
        const filtered = collaboratorCompany.filter((collaborator: any) =>
            collaborator.collaborator.name.toLowerCase().includes(searchValue)
        );
        setFilteredCollaborators(filtered);
    }, [formik.values.searchInput, collaboratorCompany]);

    return (
        <PageWrapper title="Lista de Colaboradores">
            <SubHeader className="mt-3">
                <SubHeaderLeft>
                    <label
                        className="border-0 bg-transparent cursor-pointer me-0"
                        htmlFor="searchInput"
                    >
                        <Icon icon="Search" size="2x" color="primary" />
                    </label>
                    <Input
                        id="searchInput"
                        type="search"
                        className="border-0 shadow-none bg-transparent"
                        placeholder="Pesquisar..."
                        onChange={formik.handleChange}
                        value={formik.values.searchInput}
                    />
                </SubHeaderLeft>
            </SubHeader>

            {loader ? (
                <div className="p-5">
                    <h1>🔍 Buscando Colaboradores</h1>
                </div>
            ) : (
                <Page container="fluid">
                    <div className="row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2">
                        {filteredCollaborators.length > 0 ? (
                            filteredCollaborators.map((job: any) => (
                                <div key={job.collaborator.id} className="col">
                                    <Card>
                                        <CardBody>
                                            <div className="row g-3">
                                                <div className="col d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="position-relative">
                                                            <div
                                                                className="ratio ratio-1x1"
                                                                style={{ width: 100 }}
                                                            >
                                                                <div className="rounded-2 d-flex align-items-center justify-content-center overflow-hidden shadow">
                                                                    <img
                                                                        src={job.picture}
                                                                        alt={job.collaborator.name}
                                                                        width={100}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3 d-flex justify-content-between">
                                                        <div className="w-100">
                                                            <div className="row">
                                                                <div className="col">
                                                                    <div className="d-flex flex-column gap-3 align-items-start">
                                                                        <div className="fw-bold fs-5 me-2">
                                                                            {Mask(
                                                                                'firstName',
                                                                                job.collaborator.name
                                                                            )}{' '}
                                                                            {Mask(
                                                                                'secondName',
                                                                                job.collaborator.name
                                                                            )}
                                                                        </div>
                                                                        <small
                                                                            className={`border ${
                                                                                job.isDeleted
                                                                                    ? 'border-danger text-danger'
                                                                                    : 'border-success text-success'
                                                                            } border-2 fw-bold px-2 py-1 rounded-1`}
                                                                        >
                                                                            {job.isDeleted
                                                                                ? 'Inativo'
                                                                                : 'Ativo'}
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <div className="p-5 w-full">
                                <h1>Nenhum colaborador encontrado</h1>
                            </div>
                        )}
                    </div>
                </Page>
            )}
        </PageWrapper>
    );
};

export default CollaboratorList;
