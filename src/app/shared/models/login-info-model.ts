import { SysUserModel } from './sys-user-model';


export class LoginInfoModel{
  constructor(public id?: string,
    public sysUser?: SysUserModel,
    public loginDate?: Date,
    public logoutDate?: Date,
    public status?: string,
    public longitude?: string,
    public latitude?: string,
    public vclId?: string,
    public vclCode?: string,
    public vclDescEn?: string,
    public vclSizeId?: string,
    public vclSizeDescEn?: string,
    public vclSizeDescAr?: string,
    public teamDescEn?: string,
    public teamId?: string,
    public driverNameAr?: string,
    public driverNameEn?: string,
    public driverId?: string,
    public spNameAr?: string,
    public spNameEn?: string,
    public spId?: string){}
}
