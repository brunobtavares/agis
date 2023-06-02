import { UserModel } from "./userModel"

export type ResponseModel = {
    data: UserModel,
    message: string,
    success: boolean
}