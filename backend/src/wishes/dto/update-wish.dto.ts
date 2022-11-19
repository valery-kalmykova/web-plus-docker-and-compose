import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsNumber()
  @IsOptional()
  copied?: number;

  @IsNumber()
  @IsOptional()
  raised?: number;
}
