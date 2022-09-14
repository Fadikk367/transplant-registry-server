import { IsEnum, IsOptional } from "class-validator";
import { HLA, OrganStatus, OrganType } from "constants/enums";

class OrganFiltersDto {
  @IsEnum(OrganType)
  @IsOptional()
  type?: OrganType;

  @IsEnum(HLA)
  @IsOptional()
  hla?: HLA;

  @IsEnum(OrganStatus)
  @IsOptional()
  status?: OrganStatus;
}

export default OrganFiltersDto;
