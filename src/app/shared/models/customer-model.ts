import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

export class CustomerModel {
  constructor(
    public id?: number,
    public phoneNumber?: StringMap,
    public fullNameAr?: string,
    public fullNameEn?: string,
    public gender?: string
  ) {}
}
