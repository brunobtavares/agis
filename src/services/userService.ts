'use client';
import { ResponseModel } from '@/models/ResponseModel';
import { GradeModel } from '@/models/gradeModel';
import { UserDataModel } from '@/models/userData';
import { UserModel } from '@/models/userModel';
import axios from 'axios';
import { StorageService } from './storageService';

export async function loginAsync(username: string, password: string) {
  const hash = StorageService.createHash(username, password);

  const response = await axios.post<ResponseModel<UserModel>>('api/login', null, {
    headers: {
      Authorization: hash,
    },
  });

  if (response.data && response.data.success) {
    StorageService.saveHash(hash);
  }

  return response;
}

export async function getUserDataAsync(hash: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();

  const response = await axios.post<ResponseModel<UserDataModel>>('api/user', null, {
    headers: {
      Authorization: hash,
    },
  });

  if (response.data.success) {
    StorageService.saveUserData(response.data.data);
    return response;
  }

  response.data.success = true;
  response.data.data = StorageService.getUserData();
  return response;
}

export async function getProfileAsync(hash: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();

  const response = await axios.post<ResponseModel<UserModel>>(`api/profile`, null, {
    headers: {
      Authorization: hash,
    },
  });

  return response;
}

export async function getGradeAsync(hash: string, classCode: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();

  const response = await axios.post<ResponseModel<GradeModel[]>>(
    `api/grade`,
    { classCode },
    {
      headers: {
        Authorization: hash,
      },
    }
  );

  return response;
}
