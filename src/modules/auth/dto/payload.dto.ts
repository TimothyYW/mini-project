import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";

export enum Role {
  CUSTOMER = "CUSTOMER",
  ORGANIZER = "ORGANIZER",
}

export class PayloadDTO {
  @IsNotEmpty()
  @IsString()
  id!: number;

 
  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;

}
