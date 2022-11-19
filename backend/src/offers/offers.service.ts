import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private emailSenderService: EmailSenderService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    await this.wishesService.incrementNumber(
      createOfferDto.itemId,
      'raised',
      createOfferDto.amount,
    );
    const updatedWish = await this.wishesService.findById(
      createOfferDto.itemId,
    );
    const newOffer = this.offerRepository.create({
      ...createOfferDto,
      item: updatedWish,
      user: user,
    });
    await this.offerRepository.save(newOffer);
    if (updatedWish.raised === updatedWish.price) {
      const receivers = [user.email];
      updatedWish.offers.map((offer) => receivers.push(offer.user.email));
      this.emailSenderService.sendMail(updatedWish, receivers);
    }
    return newOffer;
  }
}
