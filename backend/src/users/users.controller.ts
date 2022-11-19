import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseInterceptors(ClassSerializerInterceptor)
  async findMe(@Request() req: any): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOne(req.user.username);
    return user;
  }

  @Patch('/me')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const username = req.user.username;
    const user = await this.usersService.updateOne(username, updateUserDto);
    return user;
  }

  @Get('/me/wishes')
  async findUserWishes(@Request() req: any): Promise<Wish[]> {
    return this.usersService.findUserWishes(req.user.username);
  }

  @Get(':username')
  @UseInterceptors(ClassSerializerInterceptor)
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.usersService.findOne(username);
    const convert = plainToInstance(UserPublicProfileResponseDto, user);
    return convert;
  }

  @Get(':username/wishes')
  async findWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return this.usersService.findUserWishes(username);
  }

  @Post('/find')
  @UseInterceptors(ClassSerializerInterceptor)
  async finByParameter(
    @Body('query') query: string,
  ): Promise<UserPublicProfileResponseDto[]> {
    const users = await this.usersService.findByParameter(query);
    const response = users.map((user) => {
      const convert = plainToInstance(UserPublicProfileResponseDto, user);
      return convert;
    });
    return response;
  }
}
