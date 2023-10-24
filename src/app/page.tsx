'use client'
import { ResponseModel } from '@/models/ResponseModel';
import { UserModel } from '@/models/userModel';
import { getUserData } from '@/services/userService';
import { encrypt } from '@/utils/CryptoHelper';
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
  const { isLoading } = useSWR('/userData', () => getUserData(user, password));

  useEffect(() => {
    if (localStorage.getItem('hash')) { router.push('/user'); }
  });

  function showToastError() {
    if (toast && toast.current) { toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha invalido!' }); }
  }

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || user == '' || password == '') return;
    setLoading(true);

    mutate<ResponseModel<UserModel>>('/userData')
      .then((response) => {

        if (!response || !response.success) {
          setLoading(false);
          showToastError();
          return;
        }

        var hash = encrypt(JSON.stringify({ "user": user, "password": password }));

        localStorage.setItem('hash', hash);

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
