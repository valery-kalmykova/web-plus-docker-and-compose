import {
  Controller,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { SigninUserDto } from './auth/dto/signin-user.dto';
import { UserProfileResponseDto } from './users/dto/user-profile-response.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Body() signinUserDto: SigninUserDto) {
    return this.authService.login(signinUserDto);
  }
}
