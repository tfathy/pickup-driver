import { SpMemberModel } from './sp-member-model';
import { SpModel } from './sp-model';

export class DriverModel {
  constructor(
    public fullNameAr?: string,
    public fullNameEn?: string,
    public email?: string,
    public userId?: string,
    public userType?: string,
    public sp?: SpModel,
    public member?: SpMemberModel
  ) {}
}
