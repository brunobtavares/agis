'use client'
import { login } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [validating, setValidating] = useState(true);
  const [username, setUsername] = useState("52729511SP");
  const [password, setPassword] = useState("bruflale77");

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    login(username, password)
      .then((response) => {
        if (response.data.success) {
          setRedirecting(true);
          router.push('/user');
        }
        else {
          if (toast && toast.current) { toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha incorreta' }); }
        }

        setLoading(false);
      });
  }

  useEffect(() => {
    if (localStorage.getItem('hash')) {
      router.push('/user');
    }
    else {
      setValidating(false);
    }
  }, []);

  if (validating) {
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
          <Button type='submit' label={redirecting ? "Redirecionando..." : "Entrar"} size="small" icon="pi pi-check" loading={loading} />
        </div>
      </form>
    </div>
  )
}