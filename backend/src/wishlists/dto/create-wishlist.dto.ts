import { IsNotEmpty, IsString, Length, IsUrl, IsArray } from 'class-validator';

export class CreateWishListDto {
  @IsNotEmpty()
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: [id: number];
}
