import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @Get('last')
  async findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Request() req: any,
  ): Promise<Wish> {
    const username = req.user.username;
    return this.wishesService.create(username, createWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Wish> {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req: any,
  ) {
    const wish = await this.wishesService.findById(id);
    if (wish.owner.username !== req.user.username) {
      throw new ConflictException('cant delete not your wish');
    }
    return this.wishesService.updateById(id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const wish = await this.wishesService.findById(id);
    if (wish.owner.username !== req.user.username) {
      throw new ConflictException('cant delete not your wish');
    }
    const res = await this.wishesService.removeById(id);
    if (res.affected === 1) {
      return this.usersService.findUserWishes(req.user.username);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async createCopy(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.wishesService.createCopy(id, req.user.username);
  }
}
