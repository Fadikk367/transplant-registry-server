import { IsEnum, IsNotEmpty } from "class-validator";
import { OrganMatchStatus } from "constants/enums";

class UpdateOrganMatchDto {
  @IsNotEmpty()
  @IsEnum(OrganMatchStatus)
  status: OrganMatchStatus;
}

export default UpdateOrganMatchDto;
