import { IsDate, IsEnum } from "class-validator";
import { HLA, OrganType } from "constants/enums";

export class CreateOrganDto {
  @IsEnum(OrganType)
  type: OrganType;

  @IsEnum(HLA)
  hla: HLA;

  // @IsDate()
  // donationDate: Date;
}
