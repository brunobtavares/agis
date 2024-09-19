import { Api } from '@/axios/client';
import { ResponseModel } from '@/models/ResponseModel';
import { UserDataModel } from '@/models/userData';
import { safeExecutionAsync } from '@/utils/safeExecution';

export async function POST(request: Request) {
  const response = await safeExecutionAsync(async () => {
    const { hash, classCode } = await request.json();
    const apiResponse = await Api.post<ResponseModel<UserDataModel>>(`/grade/${classCode}`, { token: hash });
    return apiResponse.data;
  });

  return Response.json(response);
}
