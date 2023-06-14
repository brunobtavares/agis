'use client'
import { ResponseModel } from '@/models/ResponseModel';
import { UserData } from '@/models/userData';
import { UserModel } from '@/models/userModel';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { useState } from 'react';
import useSWR from 'swr';
import { Api } from '../../axios/client';

export default function User() {
    const router = useRouter();
    const { data, error, isLoading, isValidating } = useSWR('/userData', async () => {
        const hash = localStorage.getItem('hash');

        if (!hash) {
            exit();
            return null;
        }

        var bytes = CryptoJS.AES.decrypt(hash, process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "");
        var originalText: { user: string, password: string } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const response = await Api.post<ResponseModel<UserModel>>('/userData', { user: originalText.user, password: originalText.password });

        const data = response.data;

        if (!data || !data.success) {
            if (!data.success) { console.debug('Error:', data.message); }
            exit();
            return null;
        }

        return data;
    });

    function exit(route = '/') {
        localStorage.removeItem('hash');
        router.push(route);
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
                    {
                        (!isLoading && isValidating) &&
                        <ProgressBar mode="indeterminate" style={{ height: '3px' }}></ProgressBar>
                    }
                    <div className='col-12 d-flex flex-column gap-2' style={{ overflow: 'auto', maxHeight: '80vh' }}>
                        {
                            data
                                ?
                                data.data.userData.map(d => {
                                    return (<ClassCard
                                        key={d.subject}
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

function ClassCard({ userData }: { userData: UserData }) {
    const [showModal, setShowModal] = useState<boolean>();

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
            <Card key={userData.attendances} title={
                <div>
                    <div>{userData.subject}</div>
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
                        <h6>{userData.absences}</h6>
                    </div>
                    <div>
                        <h5>Presenças</h5>
                        <h6>{userData.attendances}</h6>
                    </div>
                </div>
            </Card>
            <Dialog
                header={userData.subject}
                visible={showModal}
                onHide={() => setShowModal(false)}
                draggable={false}>
                <DataTable
                    value={userData.grade}
                    size='small'
                >
                    <Column field="0" header="Avaliação"></Column>
                    <Column field="1" header="Data de Lançamento"></Column>
                    <Column field="2" header="Nota"></Column>
                </DataTable>
            </Dialog>
        </div>
    );
}