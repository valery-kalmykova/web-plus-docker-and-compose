import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from 'shared/helpers/helpers.module';
import { HelpersService } from 'shared/helpers/helpers.service';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish, Offer, WishList])],
  controllers: [UsersController],
  providers: [UsersService, HelpersService],
  exports: [UsersService],
})
export class UsersModule {}
