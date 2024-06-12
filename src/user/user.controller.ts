import { Controller, Post, Body, HttpStatus, HttpCode, Get, Param, Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<any> {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get('/:userId/booked-events')
  async getBookedEvents(
    @Param('userId') userId: string,
    @Headers('Authorization') authorization: string
  ): Promise<any> {
    await this.authService.authentication(authorization);
    return await this.userService.getBookedEvents(userId);
  }

  @Post('/:userId/cancel/:eventId')
  @HttpCode(HttpStatus.OK)
  async cancelBooking(
    @Param('userId') userId: string, 
    @Param('eventId') eventId: string,
    @Headers('Authorization') authorization: string
  ): Promise<any> {
    await this.authService.authentication(authorization);
    return await this.userService.cancelBooking(eventId, userId);
  }
}