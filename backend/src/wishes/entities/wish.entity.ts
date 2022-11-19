import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { BaseEntity } from 'shared/entities/base.entity';
import {
  IsUrl,
  IsNumber,
  IsNotEmpty,
  Length,
  IsString,
  Min,
  IsArray,
} from 'class-validator';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  owner: User;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsArray()
  offers: Offer[];

  @Column({ default: 0 })
  @IsNumber()
  copied: number;
}
