import { IsNotEmpty } from "class-validator";

export class CreateHospitalDto {
  @IsNotEmpty ()
  name: string;

  @IsNotEmpty ()
  city: string;

  @IsNotEmpty ()
  login: string;

  @IsNotEmpty ()
  password: string;
}
