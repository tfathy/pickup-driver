import { SpMemberModel } from './sp-member-model';
import { SpModel } from './sp-model';
import { VclModel } from './vcl-model';

export interface SlTeamModel{
  id: number;
  activeFlag: string;
  descAr: string;
  descEn: string;
  startDate: Date;
  endDate: Date;
  sp: SpModel;
  spMember: SpMemberModel;
  vehicle: VclModel;
}
