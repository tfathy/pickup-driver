import { SlOrderModel } from './sl-order-model';

export class OrderLocationModel{
  constructor(
    public id?: number,
    public slOrder?: SlOrderModel,
    public lat?: string,
    public lng?: string,
    public locationDate?: Date,
    public status?: string
  ){}
}
