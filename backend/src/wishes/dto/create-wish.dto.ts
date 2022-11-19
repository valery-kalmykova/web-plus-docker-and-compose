import {
  IsNotEmpty,
  IsString,
  Length,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;
}
