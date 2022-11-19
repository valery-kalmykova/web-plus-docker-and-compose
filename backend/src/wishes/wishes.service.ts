import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: {
        id: id,
      },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async create(username: string, createWishDto: CreateWishDto): Promise<Wish> {
    const user = await this.usersService.findOne(username);
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
    await this.wishRepository.save(newWish);
    return newWish;
  }

  async removeById(id: number) {
    return this.wishRepository.delete({ id });
  }

  async updateById(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const result = await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .set({
        ...updateWishDto,
      })
      .where('id = :id', { id: id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return result.raw[0];
  }

  async createCopy(idCopy: number, username: string): Promise<Wish> {
    const currentWish = await this.findById(idCopy);
    const { name, description, image, link, price } = currentWish;
    const newWish = await this.create(username, {
      name,
      description,
      image,
      link,
      price,
    });
    await this.incrementNumber(idCopy, 'copied', 1);
    return newWish;
  }

  async incrementNumber(id: number, field: string, amount: number) {
    await this.wishRepository.increment({ id: id }, field, amount);
  }
}
