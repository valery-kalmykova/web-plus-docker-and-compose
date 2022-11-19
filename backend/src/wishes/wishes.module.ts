import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersService } from 'shared/helpers/helpers.service';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Offer, Wish])],
  controllers: [WishesController],
  providers: [WishesService, UsersService, HelpersService],
})
export class WishesModule {}
