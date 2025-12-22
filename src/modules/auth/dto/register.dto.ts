import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum Role {
  CUSTOMER = "CUSTOMER",
  ORGANIZER = "ORGANIZER",
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  // Optional: default to CUSTOMER in service
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  // Optional referral code
  @IsOptional()
  @IsString()
  referralCode?: string;
}
