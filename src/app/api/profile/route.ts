import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserModel } from '@/models/userModel';
import { safeExecutionAsync } from '@/utils/safeExecution';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const hash = request.headers.get('Authorization');
    const apiResponse = await Api.post<ResponseModel<UserModel>>(`/user/profile`, { token: hash });
    return apiResponse.data;
  });

  return NextResponse.json(response);
}
