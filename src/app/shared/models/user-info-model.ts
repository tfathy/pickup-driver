import { CustomerModel } from './customer-model';

export interface UserInfoModel {
  userId: string;
  email: string;
  encryptedPassword: string;
  userType: string;
  accountStatus: string;
  fcmToken: string;
  id: number;
  customer: CustomerModel;
}
