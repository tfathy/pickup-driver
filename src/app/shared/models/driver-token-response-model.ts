import { SpMemberModel } from './sp-member-model';
import { SpModel } from './sp-model';

export class DriverTokenResponseModel {
  constructor(
    public userId: string,
    public email: string,
    public encryptedPassword: string,
    public userType: string,
    public accountStatus: string,
    public fcmToken: string,
    public id: number,
    public sp: SpModel,
    public member: SpMemberModel
  ) {}
}
