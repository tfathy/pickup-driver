import { SpMemberModel } from './sp-member-model';
import { SpModel } from './sp-model';


export class SysUserModel{
  constructor(public id?: number,
    public userId?: string,
    public email?: string,
    public userType?: string,
    public accountStatus?: string,
    public sp?: SpModel,
    public member?: SpMemberModel,
    ){}
}
