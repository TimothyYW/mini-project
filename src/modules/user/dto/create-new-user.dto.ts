import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateNewUserDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== null && value !== undefined ? Number(value) : undefined))
  referredById?: number;
}
