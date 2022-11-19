import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';
import { BaseEntity } from 'shared/entities/base.entity';
import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsArray()
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsArray()
  offers: Offer[];

  @OneToMany(() => WishList, (wishList) => wishList.id)
  @IsArray()
  wishlists: WishList[];
}
