import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { safeExecutionAsync } from '@/utils/safeExecution';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const { username, suggestion } = await request.json();
    const apiResponse = await Api.post<ResponseModel<any>>(`/suggestion`, { username, suggestion });
    return apiResponse.data;
  });

  return NextResponse.json(response);
}
