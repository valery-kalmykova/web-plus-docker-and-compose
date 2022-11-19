import { Exclude } from 'class-transformer';

export class UserPublicProfileResponseDto {
  id: number;
  username: string;
  about: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  @Exclude({ toPlainOnly: true })
  password: string;
  @Exclude({ toPlainOnly: true })
  email: string;
}
