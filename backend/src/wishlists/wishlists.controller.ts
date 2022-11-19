import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  ConflictException,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishList } from './entities/wishlist.entity';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<WishList[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(
    @Body() createWishListDto: CreateWishListDto,
    @Request() req: any,
  ): Promise<WishList> {
    return this.wishlistsService.create(createWishListDto, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<WishList> {
    return this.wishlistsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const wishList = await this.wishlistsService.findById(id);
    if (wishList.owner.username !== req.user.username) {
      throw new ConflictException('cant delete not your wish');
    }
    return this.wishlistsService.removeById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishListDto: UpdateWishListDto,
    @Request() req: any,
  ) {
    const wishList = await this.wishlistsService.findById(id);
    if (wishList.owner.username !== req.user.username) {
      throw new ConflictException('cant delete not your wish');
    }
    return this.wishlistsService.updateById(id, updateWishListDto);
  }
}
