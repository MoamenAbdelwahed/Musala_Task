import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from './event.model';
import { User, UserSchema } from 'src/user/user.model';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Event.name, schema: EventSchema },
    { name: User.name, schema: UserSchema }
  ])],
  controllers: [EventController],
  providers: [UserService, EventService, AuthService],
})
export class EventModule {}