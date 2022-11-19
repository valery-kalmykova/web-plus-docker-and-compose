import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWishListDto } from './dto/create-wishlist.dto';
import { UpdateWishListDto } from './dto/update-wishlist.dto';
import { WishList } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishListRepository: Repository<WishList>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<WishList[]> {
    return this.wishListRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findById(id: number): Promise<WishList> {
    const wishlist = await this.wishListRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishlist) {
      throw new NotFoundException();
    }
    return wishlist;
  }

  async create(
    createWishListDto: CreateWishListDto,
    username: string,
  ): Promise<WishList> {
    const user = await this.usersService.findOne(username);
    const { itemsId, ...rest } = createWishListDto;
    const newWishList = this.wishListRepository.create({
      ...rest,
      owner: user,
      items: itemsId.map((id: number) => ({ id } as Wish)),
    });
    await this.wishListRepository.save(newWishList);
    return newWishList;
  }

  async updateById(
    id: number,
    updateWishListDto: UpdateWishListDto,
  ): Promise<WishList> {
    const { itemsId, ...rest } = updateWishListDto;
    const wishlist = await this.findById(id);
    await this.wishListRepository.update(id, rest);
    wishlist.items = itemsId.map((id: number) => ({ id } as Wish));
    return this.wishListRepository.save(wishlist);
  }

  async removeById(id: number) {
    return this.wishListRepository.delete({ id });
  }
}
