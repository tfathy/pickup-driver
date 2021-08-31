import { DriverModel } from './driver-model';
export class UserResponseData {
  constructor(
    public email?: string,
    public driver?: DriverModel
  ) {}
}
