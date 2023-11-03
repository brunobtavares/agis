import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { GradeModel } from '@/models/gradeModel';
import { UserDataModel } from '@/models/userData';
import { UserModel } from '@/models/userModel';
import { encrypt } from '@/utils/CryptoHelper';
import { useRouter } from 'next/router';

export async function getUserData() {
    try {
        const hash = saveLogin();

        const response = await Api.post<ResponseModel<UserDataModel>>('/user', { token: hash });

        if (!response.data.success) {
            console.error(response.data.message);
            return null;
        };

        return response.data.data;
    } catch (error) {
        return null;
    }

}

export async function getGrade(classCode: string) {
    try {
        const hash = saveLogin()

        const response = await Api.post<ResponseModel<GradeModel[]>>(`/grade/${classCode}`, { token: hash });

        if (!response.data.success) {
            console.error(response.data.message);
            return null;
        };

        return response.data.data;
    } catch (error) {
        return null;
    }
}

export function login(username: string, password: string) {
    const hash = saveLogin(username, password);
    return Api.post<ResponseModel<UserModel>>(`/login`, { token: hash });
}

function saveLogin(username: string = '', password: string = '') {
    let hash = localStorage.getItem('hash');

    if (hash) return hash;

    if (username && password) {
        hash = encrypt(JSON.stringify({ "user": username, "password": password }));
        localStorage.setItem('hash', hash);
    }

    return hash;
}
