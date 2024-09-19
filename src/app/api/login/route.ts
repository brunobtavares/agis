import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserModel } from '@/models/userModel';
import { safeExecutionAsync } from '@/utils/safeExecution';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const { hash } = await request.json();
    const apiResponse = await Api.post<ResponseModel<UserModel>>(`/login`, { token: hash });
    return apiResponse.data;
  });

  return Response.json(response);
}
