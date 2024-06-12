import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Credentials } from './dto/credentials.dto';
import * as jwt from 'jsonwebtoken';
import { InvalidCredentialsException } from 'src/utils/exceptions/auth.exception';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() credentials: Credentials): Promise<any> {
    const user = await this.userService.findByEmail(credentials.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
    user.token = token;
    await user.save();
    
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  }
}