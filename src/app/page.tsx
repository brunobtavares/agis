'use client'
import { useUserContext } from '@/contexts/userContext';
import { login } from '@/services/userService';
import { decrypt } from '@/utils/cryptoHelper';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const { loading, setUser } = useUserContext()

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [username, setUsername] = useState<string>(process.env.NEXT_PUBLIC_USERNAME ?? '');
  const [password, setPassword] = useState<string>(process.env.NEXT_PUBLIC_PASSWORD ?? '');

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loadingLogin || (!username || !password)) return;

    setLoadingLogin(true);

    login(username, password)
      .then((response) => {
        if (response.data.success) {
          setRedirecting(true);

          const { name, ra } = response.data.data;
          setUser({
            name,
            ra,
            data: []
          });

          router.push('/user');
        }
        else {
          if (toast && toast.current) { toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Usuário ou Senha incorreta' }); }
        }

        setLoadingLogin(false);
      });
  }

  useEffect(() => {
    let hash = localStorage.getItem('hash');

    if (hash) {
      const userLoginData = decrypt(hash);

      if (userLoginData['user'] && userLoginData['password']) {
        setUsername(userLoginData['user']);
        setUsername(userLoginData['password']);
      }
    }
  }, []);

  if (loading) {
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
            name='vSIS_USUARIOID'
            id='vSIS_USUARIOID'
            autoComplete=''
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
            name='vSIS_USUARIOSENHA'
            id='vSIS_USUARIOSENHA'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className='d-flex justify-content-end w-75'>
          <Button type='submit' label={redirecting ? "Redirecionando..." : "Entrar"} size="small" icon="pi pi-check" loading={loadingLogin} />
        </div>
      </form>
    </div>
  )
}