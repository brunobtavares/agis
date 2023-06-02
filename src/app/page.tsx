'use client'
import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const router = useRouter();
  useSWR('/userData', async () => {
    const response = await Api.post<ResponseModel>('/userData', { user: user, password: password });
    const data = response.data;

    if (!data || !data.success) {
      if (!data.success) { console.debug('Error:', data.message); }
      localStorage.removeItem('hash');
      return null;
    }

    return data;
  });

  function showToastError() {
    if (toast && toast.current) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha invalido!' });
    }
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !user || !password) return;
    setLoading(true);

    mutate<ResponseModel>('/userData')
      .then((response) => {

        if (!response || !response.success) {
          setLoading(false);
          showToastError();
          return;
        }

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user, password }), 'brunobtavares').toString();
        localStorage.setItem('hash', ciphertext);

        router.push('/user');
      });
  }

  return (
    <div>
      <Toast ref={toast} position='top-center' />
      <form onSubmit={handleLogin}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className='col-6'>
            <h2>Entre com seu usário siga</h2>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user" />
              </span>
              <InputText placeholder="Usuário" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
            <div className="p-inputgroup mt-2">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock" />
              </span>
              <InputText placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='d-flex justify-content-end mt-2'>
              <Button type='submit' label="Entrar" size="small" icon="pi pi-check" loading={loading} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
