export class SpMemberModel {
  constructor(
    public id?: number,
    public fullNameAr?: string,
    public fullNameEn?: string,
    public email?: string,
    public hireDate?: Date,
    public terminatedFlag?: string,
    public jobId?: number
  ) {}
}
