'use client'
import { ClassModel } from '@/models/userData';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { Dispatch, SetStateAction, useState } from 'react';
import useSWR from 'swr';

import { getGrade, getUserData } from '@/services/userService';

export default function User() {
    const router = useRouter();
    const { data, isLoading, isValidating } = useSWR('/userData', getUserData);

    function exit() {
        localStorage.removeItem('hash');
        router.push('/');
    }

    if (!isLoading && (!data || !data.success)) {
        exit()
    }

    return (
        <div className='container'>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100svh' }}>
                <div className='w-100'>
                    <div className='d-flex gap-3'>
                        <h5 className='d-flex align-items-center ms-1'>
                            <i className="pi pi-user me-1" />
                            {
                                data ?
                                    <span>{data.data.name}</span>
                                    :
                                    <Skeleton width='17rem' height="1.3rem"></Skeleton>
                            }
                        </h5>
                        <div>
                            <i className="pi pi-sign-out text-danger mt-1" title='Sair' onClick={() => exit()} />
                        </div>
                    </div>
                    {/* <div className='mb-2'>RA: {data && data.data.ra.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</div> */}
                    {
                        (!isLoading && isValidating) &&
                        <ProgressBar mode="indeterminate" style={{ height: '3px' }}></ProgressBar>
                    }
                    <div className='col-12 d-flex flex-column gap-2' style={{ overflow: 'auto', maxHeight: '80vh' }}>
                        {
                            data
                                ?
                                data.data.classes.map(d => {
                                    return (<ClassCard
                                        key={d.name}
                                        userData={d} />);
                                })
                                :
                                <div className='col-12 d-flex flex-column gap-2'>
                                    <Skeleton height="11.5rem"></Skeleton>
                                    <Skeleton height="11.5rem"></Skeleton>
                                    <Skeleton height="11.5rem"></Skeleton>
                                    <Skeleton height="11.5rem"></Skeleton>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

function ClassCard({ userData }: { userData: ClassModel }) {
    const [showModal, setShowModal] = useState<boolean>(false);

    function defineAverageColor(average: any) {
        if (isNaN(average))
            return '';

        average = Number(average);

        if (average >= 6)
            return 'text-success';
        else
            return 'text-danger';
    }

    return (
        <div>
            <Card key={userData.attendance} title={
                <div>
                    <div>{userData.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 'lighter' }}>{userData.teacher}</div>
                </div>
            }
                className='customCardColor'
                onClick={() => setShowModal(true)}>
                <div className='d-flex gap-5'>
                    <div>
                        <h5>Média</h5>
                        <h6 className={defineAverageColor(userData.average)}>{userData.average}</h6>
                    </div>
                    <div>
                        <h5>Faltas</h5>
                        <h6>{userData.absence}</h6>
                    </div>
                    <div>
                        <h5>Presenças</h5>
                        <h6>{userData.attendance}</h6>
                    </div>
                </div>
            </Card>
            {
                showModal
                &&
                <ModalDetails
                    classCode={userData.code}
                    subject={userData.name}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            }
        </div>
    );
}

function ModalDetails({ classCode, subject, showModal, setShowModal }: { classCode: any, subject: any, showModal: boolean, setShowModal: Dispatch<SetStateAction<boolean>> }) {
    const { data, isLoading } = useSWR(`${classCode}`, getGrade);

    return (
        <div>
            <Dialog
                header={subject}
                visible={showModal}
                onHide={() => setShowModal(false)}
                draggable={false}>
                {
                    isLoading ?
                        <div className='d-flex justify-content-center align-items-center'>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                        :
                        <DataTable value={data?.data} size='small'>
                            <Column field="0" header="Avaliação"></Column>
                            <Column field="1" header="Data de Lançamento"></Column>
                            <Column field="2" header="Nota"></Column>
                        </DataTable>
                }
            </Dialog>
        </div>
    );
}