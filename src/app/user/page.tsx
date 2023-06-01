'use client'
import CryptoJS from 'crypto-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Api } from '../../axios/client';


type stats = {
    materia: any,
    media: any,
    presencas: any,
    faltas: any,
}

type Respose = {
    data: stats[],
    message: string,
    success: boolean
}

export default function User() {
    const router = useRouter();
    const { data, error, isLoading } = useSWR('/stats', async () => {

        const hash = localStorage.getItem('hash');

        if (!hash) {
            router.push('/');
            return null;
        }

        var bytes = CryptoJS.AES.decrypt(hash, 'brunobtavares');
        var originalText: { user: string, password: string } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const response = await Api.post<Respose>('/stats', { user: originalText.user, password: originalText.password });
        const data = response.data;

        if (!data || !data.success) {
            router.push('/');
            return null;
        }

        return data;
    });

    function exit() {
        localStorage.removeItem('hash');
        router.push('/');
    }

    return (
        <div className='container'>
            {
                isLoading ?
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className='col-12' style={{ overflow: 'auto', maxHeight: '80vh' }}>
                                {
                                    data?.data.map(d => {
                                        return (
                                            <Card key={d.presencas} title={d.materia} className='customCardColor my-2'>
                                                <div className='d-flex gap-5'>
                                                    <div>
                                                        <h5>Média</h5>
                                                        <h6>{d.media}</h6>
                                                    </div>
                                                    <div>
                                                        <h5>Faltas</h5>
                                                        <h6>{d.faltas}</h6>
                                                    </div>
                                                    <div>
                                                        <h5>Presenças</h5>
                                                        <h6>{d.presencas}</h6>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className='d-flex justify-content-end mt-2 mb-3'>
                            <i className="pi pi-sign-out text-danger" onClick={exit} />
                        </div>
                    </div>
            }

        </div >
    )
}