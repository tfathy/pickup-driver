import { SpMemberModel } from './sp-member-model';

export class DriverUserResponseModel {
  constructor(
    public id: number,
    public userId: string,
    public email: string,
    public member: SpMemberModel
  ) {}
}
