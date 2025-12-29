import { IsNotEmpty, IsString, IsNumber, IsPositive } from "class-validator";

export class createEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalSeats!: number;

  @IsString()
  @IsNotEmpty()
  eventDate!: Date;
}
