import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { BaseEntity } from 'shared/entities/base.entity';
import { Min, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;

  @Column()
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
