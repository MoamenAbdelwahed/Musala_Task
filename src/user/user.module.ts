import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Event, EventSchema } from 'src/event/event.model';
import { BookedEvent, BookedEventSchema } from './bookedEvent.model';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Event.name, schema: EventSchema },
    { name: BookedEvent.name, schema: BookedEventSchema }
  ])],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}