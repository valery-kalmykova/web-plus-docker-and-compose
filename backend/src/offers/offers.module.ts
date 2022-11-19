import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersService } from 'shared/helpers/helpers.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer])],
  controllers: [OffersController],
  providers: [
    OffersService,
    UsersService,
    WishesService,
    EmailSenderService,
    HelpersService,
  ],
})
export class OffersModule {}
