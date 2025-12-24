import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsDateString()
  eventDate: string;
}
