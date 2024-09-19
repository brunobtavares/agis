import { ResponseModel } from '@/models/ResponseModel';

export async function safeExecutionAsync<T>(func: () => Promise<T>) {
  try {
    return await func();
  } catch (error) {
    // console.log(error);

    return {
      message: 'Internal server error',
      success: false,
    } as ResponseModel<any>;
  }
}
