import { UserModel } from "./userModel";
export interface UserDataModel extends UserModel {
    data: DataItem[]
}

export interface DataItem {
    classCode: string;
    className: string;
    attendance: string;
    absence: string;
    average: string;
    teacherName: string;
}