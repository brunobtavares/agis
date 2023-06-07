'use client'
import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const { isLoading } = useSWR('/userData', async () => {

    let localUser = user;
    let localPassword = password;


    const hash = localStorage.getItem('hash');
    if (hash) {
      let bytes = CryptoJS.AES.decrypt(hash, process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "");
      let originalText: { user: string, password: string } = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      localUser = originalText.user;
      localPassword = originalText.password;
    }


    const response = await Api.post<ResponseModel>('/userData', { user: localUser, password: localPassword });
    const data = response.data;

    if (!data || !data.success) {
      if (!data.success) { console.debug('Error:', data.message); }
      return null;
    }

    return data;
  });

  useEffect(() => {
    const hash = localStorage.getItem('hash');
    if (hash) {
      router.push('/user');
    }
  });

  function showToastError() {
    if (toast && toast.current) {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha invalido!' });
    }
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || user == '' || password == '') return;
    setLoading(true);

    mutate<ResponseModel>('/userData')
      .then((response) => {

        if (!response || !response.success) {
          setLoading(false);
          showToastError();
          return;
        }

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user, password }), process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? "").toString();
        localStorage.setItem('hash', ciphertext);

        router.push('/user');
      });
  }

  if (isLoading) {
    return (
      <div className='container'>
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
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
              <InputText
                placeholder="Usuário"
                onChange={(e) => setUser(e.target.value.toUpperCase())}
                value={user} />
            </div>
            <div className="p-inputgroup mt-2">
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock" />
              </span>
              <InputText
                placeholder="Senha"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password} />
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
