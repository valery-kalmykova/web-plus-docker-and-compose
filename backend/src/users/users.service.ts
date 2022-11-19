import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelpersService } from 'shared/helpers/helpers.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private helpersService: HelpersService,
  ) {}

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByParameter(query: string): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .where('user.username like :username', { username: `%${query}%` })
      .orWhere('user.email like :email', { email: `%${query}%` })
      .getMany();
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const findName = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    if (findName) {
      throw new ConflictException('Username already exists');
    }
    const hash = await this.helpersService.hashPassword(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateOne(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.password) {
      const hash = await this.helpersService.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hash;
    }
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        ...updateUserDto,
      })
      .where('username = :username', { username: username })
      .returning('*')
      .updateEntity(true)
      .execute();
    return result.raw[0];
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const userRelation = await this.userRepository.findOne({
      relations: {
        wishes: true,
      },
      where: {
        username: username,
      },
    });
    return userRelation.wishes;
  }

  async removeById(id: number): Promise<void> {
    this.userRepository.delete({ id });
  }
}
