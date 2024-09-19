import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserDataModel } from '@/models/userData';
import { safeExecutionAsync } from '@/utils/safeExecution';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const { hash, classCode } = await request.json();
    const apiResponse = await Api.post<ResponseModel<UserDataModel>>(`/grade/${classCode}`, { token: hash });
    return apiResponse.data;
  });

  return NextResponse.json(response);
}
