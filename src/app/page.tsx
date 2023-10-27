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
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { data, isLoading } = useSWR('/userData', () => getUserData(username, password));

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    var hash = encrypt(JSON.stringify({ "user": username, "password": password }));
    localStorage.setItem('hash', hash);

    mutate<ResponseModel<UserModel>>('/userData')
      .then((response) => {

        if (!response || !response.success) {
          setLoading(false);
          if (toast && toast.current) { toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha invalido!' }); }
          return;
        }
        setLoading(false);
      });
  }

  function checkIfUserIsLogedIn() {
    if (data && data.success) {
      router.push('/user');
    }
  }

  useEffect(() => { checkIfUserIsLogedIn(); }, [data]);

  if (isLoading) {
    return (
      <div style={{ height: '100vh' }}>
        <div className='d-flex justify-content-center align-items-center h-100'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <Toast ref={toast} position='top-center' />
      <form
        onSubmit={handleLogin}
        className='d-flex flex-column justify-content-center align-items-center gap-2 h-100'
      >
        <h4 className='w-75'>Entre com seu usário siga</h4>

        <div className="p-inputgroup w-75">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user" />
          </span>
          <InputText
            placeholder="Usuário"
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
            value={username}
          />
        </div>

        <div className="p-inputgroup w-75">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock" />
          </span>
          <InputText
            placeholder="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className='d-flex justify-content-end w-75'>
          <Button type='submit' label="Entrar" size="small" icon="pi pi-check" loading={loading} />
        </div>
      </form>
    </div>
  )
}