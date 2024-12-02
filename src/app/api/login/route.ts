import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserModel } from '@/models/userModel';
import { safeExecutionAsync } from '@/utils/safeExecution';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const hash = request.headers.get('Authorization');
    const apiResponse = await Api.post<ResponseModel<UserModel>>(`/login`, { token: hash });
    return apiResponse.data;
  });

  if (response.message == 'Internal server error' && response.success == false) {
    return NextResponse.json(null);
  }

  return NextResponse.json(response);
}
