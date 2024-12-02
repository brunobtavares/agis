'use client';
import { StorageService } from '@/services/storageService';
import { loginAsync } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from 'react';

export default function Login() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [chekingPersistentSession, setChekingPersistentSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>(process.env.NEXT_PUBLIC_USERNAME ?? '');
  const [password, setPassword] = useState<string>(process.env.NEXT_PUBLIC_PASSWORD ?? '');

  useEffect(() => {
    if (StorageService.getHash()) router.push('/user');
    else setChekingPersistentSession(false);
  });

  async function handleUserLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || !username || !password) return;

    setLoading(true);
    const response = await loginAsync(username, password);

    if (response.data == null) {
      if (toast && toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Erro Interno',
          detail: 'O servidor encontra-se indisponível no momento',
        });
      }

      setLoading(false);
      return;
    }

    if (response.data.success == false) {
      if (toast && toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Login',
          detail: 'Usuário ou Senha incorreta',
        });
      }

      setLoading(false);
      return;
    }

    router.push('/user');
  }

  return (
    <div style={{ height: '100vh' }}>
      <Toast ref={toast} position="top-center" />
      <form
        onSubmit={handleUserLogin}
        className="d-flex flex-column justify-content-center align-items-center gap-2 h-100">
        <h4 className="w-75">Entre com seu usuário siga</h4>

        <div className="p-inputgroup w-75">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user" />
          </span>
          <InputText
            placeholder="Usuário"
            name="vSIS_USUARIOID"
            id="vSIS_USUARIOID"
            autoComplete=""
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
            name="vSIS_USUARIOSENHA"
            id="vSIS_USUARIOSENHA"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className="d-flex justify-content-end w-75">
          <Button
            type="submit"
            label="Entrar"
            size="small"
            icon="pi pi-check"
            loading={loading || chekingPersistentSession}
          />
        </div>
      </form>
    </div>
  );
}
