'use client'
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import useSWR from 'swr';
import { Api } from '../../axios/client';

type aluno = {
    name: string;
    stats: stats[]
}

type stats = {
    materia: any,
    media: any,
    presencas: any,
    faltas: any,
}

type Respose = {
    data: aluno,
    message: string,
    success: boolean
}

export default function User() {
    const router = useRouter();
    const { data, error, isLoading } = useSWR('/userData', async () => {

        const hash = localStorage.getItem('hash');

        if (!hash) {
            router.push('/');
            return null;
        }

        var bytes = CryptoJS.AES.decrypt(hash, 'brunobtavares');
        var originalText: { user: string, password: string } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const response = await Api.post<Respose>('/userData', { user: originalText.user, password: originalText.password });
        const data = response.data;

        if (!data || !data.success) {
            if (!data.success) { console.error(data.message); }
            localStorage.removeItem('hash');
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
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100svh' }}>
                        <div className='w-100'>
                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='ms-1'>
                                    <i className="pi pi-user me-1" />
                                    <span>{data?.data.name}</span>
                                </h5>
                                <div>
                                    <i className="pi pi-sign-out text-danger" title='Sair' onClick={exit} />
                                </div>
                            </div>
                            <div className='col-12 d-flex flex-column gap-2' style={{ overflow: 'auto', maxHeight: '80vh' }}>
                                {
                                    data?.data.stats.map(d => {
                                        return (
                                            <Card key={d.presencas} title={d.materia} className='customCardColor'>
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
                    </div>
            }

        </div >
    )
}