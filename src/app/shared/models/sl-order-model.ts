import { CustomerModel } from './customer-model';
import { DestLocationTypeModel } from './dest-location-type-model';
import { SourceLocationTypeModel } from './source-location-type-model';
import { TeamModel } from './team-model';
import { VehicleSizeModel } from './vehicle-size-model';

export class SlOrderModel {
  constructor(
    public id?: number,
    public customer?: CustomerModel,
    public sourceLocationType?: SourceLocationTypeModel,
    public destLocationType?: DestLocationTypeModel,
    public team?: TeamModel,
    public vehicleSize?: VehicleSizeModel,
    public requestDate?: Date,
    public reservationDate?: Date,
    public ordExecDate?: Date,
    public ordStatus?: string,
    public sourceElvFlag?: string,
    public sourceFloorNum?: string,
    public sourceLong?: string,
    public sourceLat?: string,
    public sourceImageMap?: string,
    public sourceFormattedAddress?: string,
    public destElvFlag?: string,
    public destFloorNum?: number,
    public destFormattedAddress?: string,
    public destLong?: string,
    public destLat?: string,
    public destImageMap?: string,
    public estimatedCost?: number,
    public actualCost?: number,
    public customerNotes?: string,
    public teamNotes?: string
  ) {}
}
