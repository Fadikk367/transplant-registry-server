import { IsEnum, IsNotEmpty } from "class-validator";
import { HLA, OrganType, PatientPriority } from "constants/enums";


class CreateOrganRequestDto {
  @IsNotEmpty()
  @IsEnum(OrganType)
  organ: OrganType;

  @IsNotEmpty()
  @IsEnum(HLA)
  hla: HLA;

  @IsNotEmpty()
  @IsEnum(PatientPriority)
  priority: PatientPriority;
}

export default CreateOrganRequestDto;
