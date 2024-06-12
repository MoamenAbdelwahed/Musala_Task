import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.model';
import { Event, EventSchema } from 'src/event/event.model';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Event.name, schema: EventSchema }
  ])],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule {}