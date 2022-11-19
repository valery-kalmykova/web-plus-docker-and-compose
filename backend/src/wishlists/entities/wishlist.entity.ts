import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'shared/entities/base.entity';
import { IsNotEmpty, IsString, Length, IsUrl, IsArray } from 'class-validator';

@Entity()
export class WishList extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsArray()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  owner: User;
}
