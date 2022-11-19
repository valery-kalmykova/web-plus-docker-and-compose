import { IsNotEmpty, Min, IsNumber, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  @IsNumber()
  itemId: number;
}
