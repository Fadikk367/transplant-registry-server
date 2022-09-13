import { IsEnum, IsOptional } from "class-validator";

import { HLA, OrganType, PatientPriority } from "constants/enums";


class FilterOrganRequestsDto {
  @IsOptional()
  @IsEnum(OrganType)
  organ?: OrganType;

  @IsOptional()
  @IsEnum(HLA)
  hla?: HLA;

  @IsOptional()
  @IsEnum(PatientPriority)
  priority?: PatientPriority;
}

export default FilterOrganRequestsDto;
