import { IsEnum, IsOptional } from "class-validator";
import { HLA, OrganType } from "constants/enums";

class OrganFiltersDto {
  @IsEnum(OrganType)
  @IsOptional()
  type?: OrganType;

  @IsEnum(HLA)
  @IsOptional()
  hla?: HLA;
}

export default OrganFiltersDto;
