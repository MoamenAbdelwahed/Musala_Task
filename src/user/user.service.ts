import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { Event } from '../event/event.model';
import { BookedEvent } from './bookedEvent.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Event.name) private eventModel: Model<Event>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async updateUserBookedEvents(userId: string, eventId: string, attendeesCount: number): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { bookedEvents: { eventId, attendeesCount } },
      },
      { new: true }
    );
  
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  
    return user;
  }

  async getBookedEvents(userId: string): Promise<BookedEvent[]> {
    const user = await this.userModel.findById(userId);
    return user?.bookedEvents || [];
  }

  async cancelBooking(eventId: string, userId: string): Promise<BookedEvent[]> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const bookedEventsToDelete = user.bookedEvents.filter((event) => event.eventId === eventId);

    if (!bookedEventsToDelete.length) {
      throw new HttpException('No booking found', HttpStatus.BAD_REQUEST);
    }
    
    const attendeesCount = bookedEventsToDelete.reduce((acc, bookedEvent) => acc + bookedEvent.attendeesCount, 0);

    const event = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { availableAttendeesCount: attendeesCount } },
      { new: true }
    );

    if (!event) {
      return null;
    }

    await this.userModel.findByIdAndUpdate(
      userId,
      { $pullAll: { bookedEvents: bookedEventsToDelete.map((event) => event._id) } },
      { new: true }
    );

    return bookedEventsToDelete;
  }

  async getUsersForUpcomingEvent(eventId: string): Promise<User[]> {
    return this.userModel.find({
      bookedEvents: { $elemMatch: { eventId} }
    });
  }
}
