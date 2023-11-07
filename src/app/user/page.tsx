'use client'
import { useUserContext } from '@/contexts/userContext';
import { GradeModel } from '@/models/gradeModel';
import { DataItems } from '@/models/userData';
import { getGrade, getUserData } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from 'primereact/skeleton';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';


export default function User() {
    const router = useRouter();
    const { user, setUser } = useUserContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserData()
            .then((response) => {
                if (response) {
                    setUser(response);
                }
                else { exit(); }
            })
            .catch(() => exit())
            .finally(() => setLoading(false));
    }, []);

    function exit() {
        localStorage.removeItem('hash');
        router.push('/');
    }

    return (
        <div className='container mt-sm-2 mt-md-5'>
            <div className='d-flex align-items-center'>
                <i className="pi pi-user mx-1" />
                <span className='usernameText'>
                    {user ? user.name : <Skeleton width='17rem' height="1.3rem"></Skeleton>}
                </span>
                <i className="pi pi-sign-out text-danger ms-2" title='Sair' onClick={() => exit()} />
            </div>
            <div className='mt-1'>
                {
                    loading || !user ?
                        <div className='d-flex flex-column gap-2'>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                        </div>
                        :
                        user.data.map((data) => { return <ClassCard key={data.classCode} classData={data} /> })
                }
            </div>
        </div>
    )
}

function ClassCard({ classData }: { classData: DataItems }) {
    const [showModal, setShowModal] = useState<boolean>(false);

    function defineAverageColor(average: any) {
        const numericAverage = Number(average);

        if (isNaN(numericAverage)) { return ''; }

        return numericAverage >= 6 ? 'text-success' : 'text-danger';
    }

    return (
        <div className='mb-2'>
            <Card
                title={
                    <div>
                        <div>{classData.className}</div>
                        <div style={{ fontSize: 12, fontWeight: 'lighter' }}>{classData.teacherName}</div>
                    </div>
                }
                className='customCardColor'
                onClick={() => setShowModal(true)}>
                <div className='d-flex gap-5'>
                    <div>
                        <h5>Média</h5>
                        <h6 className={defineAverageColor(classData.average)}>{classData.average}</h6>
                    </div>
                    <div>
                        <h5>Faltas</h5>
                        <h6>{classData.absence}</h6>
                    </div>
                    <div>
                        <h5>Presenças</h5>
                        <h6>{classData.attendance}</h6>
                    </div>
                </div>
            </Card>
            {
                showModal
                &&
                <ModalDetails
                    classCode={classData.classCode}
                    subject={classData.className}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            }
        </div>
    );
}

function ModalDetails({ classCode, subject, showModal, setShowModal }: { classCode: any, subject: any, showModal: boolean, setShowModal: Dispatch<SetStateAction<boolean>> }) {
    const { data, isLoading } = useSWR(`${classCode}`, getGrade);
    const [grade, setGrade] = useState<GradeModel>();

    useEffect(() => {
        if (data) {
            const item: GradeModel = data.find(x => x.classCode == classCode)!;
            setGrade(item);
        }
    }, [data]);

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
                        <DataTable value={grade?.grade} size='small'>
                            <Column field="0" header="Avaliação"></Column>
                            <Column field="1" header="Data de Lançamento"></Column>
                            <Column field="2" header="Nota"></Column>
                        </DataTable>
                }
            </Dialog>
        </div>
    );
}