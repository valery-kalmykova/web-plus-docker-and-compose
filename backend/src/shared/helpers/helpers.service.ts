import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HelpersService {
  compare(pass: string, userPass: string) {
    return bcrypt.compare(pass, userPass);
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
