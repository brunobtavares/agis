import { Api } from "@/axios/client";
import { ResponseModel } from "@/models/ResponseModel";
import { GradeModel } from "@/models/gradeModel";
import { UserDataModel } from "@/models/userData";
import { UserModel } from "@/models/userModel";
import { encrypt } from "@/utils/cryptoHelper";

export async function getUserData() {
  try {
    const hash = getHash();

    const response = await Api.post<ResponseModel<UserDataModel>>("/user", {
      token: hash,
    });

    console.log(response);

    if (!response.data.success) {
      console.error(response.data.message);
      return null;
    }

    const userData = response.data.data;
    saveUserData(userData);

    return userData;
  } catch (error) {
    return getSavedUserData();
  }
}

export async function getGrade(classCode: string) {
  try {
    const hash = getHash();

    const response = await Api.post<ResponseModel<GradeModel[]>>(
      `/grade/${classCode}`,
      { token: hash },
    );

    if (!response.data.success) {
      console.error(response.data.message);
      return null;
    }

    return response.data.data;
  } catch (error) {
    return null;
  }
}

export function login(username: string, password: string) {
  const hash = saveHash(username, password);
  return Api.post<ResponseModel<UserModel>>(`/login`, { token: hash });
}

export function getUserProfile() {
  const hash = getHash();

  if (!hash) return Promise.resolve({ data: null });

  return Api.post<ResponseModel<UserModel>>(
    `/profile`,
    { token: hash },
    { timeout: 20500 },
  );
}

function saveHash(username: string, password: string) {
  const hash = encrypt(JSON.stringify({ user: username, password: password }));
  localStorage.setItem("hash", hash);

  return hash;
}

function saveUserData(data: UserDataModel) {
  const userData = JSON.stringify(data);
  localStorage.setItem("userData", userData);
}

function getSavedUserData() {
  const userData =
    localStorage.getItem("userData") || '{"name":"Sair","ra":"Erro","data":[]}';
  return JSON.parse(userData) as UserDataModel;
}

export function getHash() {
  let hash = localStorage.getItem("hash");
  return hash;
}
