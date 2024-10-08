'use client'
import { ResponseModel } from '@/models/ResponseModel';
import { GradeModel } from '@/models/gradeModel';
import { UserDataModel } from '@/models/userData';
import { UserModel } from '@/models/userModel';
import axios from 'axios';
import { StorageService } from './storageService';

export async function loginAsync(username: string, password: string) {
  const hash = StorageService.saveHash(username, password);
  const response = await axios.post<ResponseModel<UserModel>>('api/login', { hash });
  return response;
}

export async function getUserDataAsync(hash: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();
  const response = await axios.post<ResponseModel<UserDataModel>>('api/user', { hash });

  if (response.data.success) {
    StorageService.saveUserData(response.data.data);
    return response;
  }

  response.data.data = StorageService.getUserData();
  return response;
}

export async function getProfileAsync(hash: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();
  const response = await axios.post<ResponseModel<UserModel>>(`api/profile`, { hash });
  return response;
}

export async function getGradeAsync(hash: string, classCode: string) {
  if (hash == null || hash == '') hash = StorageService.getHash();
  const response = await axios.post<ResponseModel<GradeModel[]>>(`api/grade`, { hash, classCode });
  return response;
}
