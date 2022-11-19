import { PartialType } from '@nestjs/mapped-types';
import { CreateWishListDto } from './create-wishlist.dto';

export class UpdateWishListDto extends PartialType(CreateWishListDto) {}
