import { IsEnum, IsOptional } from "class-validator";

import { HLA, OrganRequestStatus, OrganType, PatientPriority } from "constants/enums";


class FilterOrganRequestsDto {
  @IsOptional()
  @IsEnum(OrganType)
  organ?: OrganType;

  @IsOptional()
  @IsEnum(HLA)
  hla?: HLA;

  @IsOptional()
  @IsEnum(OrganRequestStatus)
  status?: OrganRequestStatus;

  @IsOptional()
  @IsEnum(PatientPriority)
  priority?: PatientPriority;
}

export default FilterOrganRequestsDto;
