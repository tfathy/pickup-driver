/* eslint-disable no-underscore-dangle */
export class UserModel {
  constructor(
    public email: string,
    public userId: string,
    public fullNameEn: string,
    public fullNameAr: string,
    public userType: string,
    public accountStatus: string,
    public _token?: string,
    private _tokenExpirationDate?: Date
  ) {}
  get token() {
    if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this._tokenExpirationDate.getTime() - new Date().getTime();
  }
}
