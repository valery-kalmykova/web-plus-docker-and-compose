import {
  Body,
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Request,
  ParseIntPipe,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(
    private offersService: OffersService,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    return this.offersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req: any,
  ): Promise<Offer> {
    const wish = await this.wishesService.findById(createOfferDto.itemId);
    const user = await this.usersService.findOne(req.user.username);
    if (wish.owner.id === user.id) {
      throw new ConflictException('you cant offer for your wish');
    } else if (wish.price - wish.raised < createOfferDto.amount) {
      throw new ConflictException('you cant offer more then rest of price');
    } else {
      return this.offersService.create(createOfferDto, user);
    }
  }
}
