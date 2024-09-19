'use client';
import { UserDataModel } from '@/models/userData';
import { encrypt } from '@/utils/cryptoHelper';

class StoraService {
  saveHash(username: string, password: string) {
    const hash = encrypt(JSON.stringify({ user: username, password: password }));
    localStorage.setItem('hash', hash);
    return hash;
  }

  saveUserData(data: UserDataModel) {
    const userData = JSON.stringify(data);
    localStorage.setItem('userData', userData);
  }

  getUserData() {
    const userData = localStorage.getItem('userData') || '{"name":"Sair","ra":"Erro","data":[]}';
    return JSON.parse(userData) as UserDataModel;
  }

  getHash() {
    let hash = localStorage.getItem('hash');
    return hash ?? '';
  }

  clear() {
    localStorage.clear();
  }
}

export const StorageService = new StoraService();
