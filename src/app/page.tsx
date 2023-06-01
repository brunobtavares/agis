'use client'
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('hash')) {
      router.push('/user');
    }
  }, []);

  function handleLogin() {
    if (!user || !password) return;

    setLoading(true);
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ user, password }), 'brunobtavares').toString();
    localStorage.setItem('hash', ciphertext);
    router.push('/user');
  }

  return (
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
          <Button label="Entrar" size="small" icon="pi pi-check" loading={loading} onClick={handleLogin} />
        </div>
      </div>
    </div>
  )
}
