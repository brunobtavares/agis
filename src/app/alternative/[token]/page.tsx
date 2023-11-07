'use client'
import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { DataItem, UserDataModel } from '@/models/userData';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { exit } from 'process';
import { useEffect, useState } from 'react';

export default function Alternative({ params }: { params: { token: string } }) {
    const [user, setUser] = useState<UserDataModel>()
    const [error, setError] = useState(false)

    useEffect(() => {
        Api.post<ResponseModel<UserDataModel>>('/alternative', { token: params.token })
            .then((response) => {
                if (response.data.success) {
                    setUser(response.data.data);
                }
            })
            .catch((err) => {
                setError(true);
                console.log(err);
            });
    }, []);

    if (error) {
        return (<h1>Erro</h1>);
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
                    user ?
                        user.data.map((data) => { return <ClassCard key={data.classCode} classData={data} /> })
                        :
                        <div className='d-flex flex-column gap-2'>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                            <Skeleton height="11.5rem"></Skeleton>
                        </div>
                }
            </div>
        </div>
    )
}

function ClassCard({ classData }: { classData: DataItem }) {
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
        </div>
    );
}
