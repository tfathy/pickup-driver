import { SpModel } from './sp-model';
import { VehicleSizeModel } from './vehicle-size-model';

export interface VclModel {
  activeFlag: string;
  code: string;
  descAr: string;
  descEn: string;
  id: number;
  imageFileName: string;
  licenExpDate: Date;
  modelCompany: string;
  modelYear: number;
  notes: string;
  sp: SpModel;
  vehicleSize: VehicleSizeModel;
}
