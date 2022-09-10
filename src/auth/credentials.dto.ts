import { IsNotEmpty } from "class-validator";

class CredentialsDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}

export default CredentialsDto;
