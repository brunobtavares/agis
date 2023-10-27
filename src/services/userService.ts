import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserModel } from '@/models/userModel';
import { encrypt } from '@/utils/CryptoHelper';

export async function getUserData(user: string, password: string) {
    let hash = localStorage.getItem('hash');

    if (!hash) {
        hash = encrypt(JSON.stringify({ "user": user, "password": password }));
    }

    const response = await Api.post<ResponseModel<UserModel>>('/userData', { token: hash });
    const data = response.data;

    if (!data || !data.success) {
        if (!data.success) { console.debug('Error:', data.message); }
        return null;
    }

    return data;
}

export async function getGrade(classCode: string) {
    let hash = localStorage.getItem('hash');

    if (!hash) { return null; }

    const response = await Api.post<ResponseModel<[]>>(`/grade/${classCode}`, { token: hash });
    const data = response.data;

    if (!data || !data.success) {
        if (!data.success) { console.debug('Error:', data.message); }
        return null;
    }

    return data;
}