import { UserModel } from "./userModel";
export interface UserDataModel extends UserModel {
    data: DataItems[]
}

export interface DataItems {
    classCode: string;
    className: string;
    attendance: string;
    absence: string;
    average: string;
    teacherName: string;
}