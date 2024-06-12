import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './user.model';
import { Event, EventSchema } from '../event/event.model';
import { CreateUserDto } from './dto/create-user.dto';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

const mockUserModel = {
  findOne: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  constructor: jest.fn().mockImplementation((createUserDto: CreateUserDto) => ({
    ...createUserDto,
    save: mockUserModel.save,
  })),
};

const mockEventModel = {
  findByIdAndUpdate: jest.fn(),
};

describe('UserService', () => {
    let service: UserService;
    let userModel: Model<User>;
    let eventModel: Model<Event>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          MongooseModule.forRootAsync({
            useFactory: async () => ({
              uri: process.env.MONGO_TEST_URI
            }),
          }),
          MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Event.name, schema: EventSchema },
          ]),
        ],
        providers: [
          UserService,
          {
            provide: getModelToken(User.name),
            useValue: mockUserModel,
          },
          {
            provide: getModelToken(Event.name),
            useValue: mockEventModel,
          },
        ],
      }).compile();
  
      service = module.get<UserService>(UserService);
      userModel = module.get<Model<User>>(getModelToken(User.name));
      eventModel = module.get<Model<Event>>(getModelToken(Event.name));
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should update user booked events with attendees count', async () => {
        const userId = '123';
        const eventId = '456';
        const attendeesCount = 2;
      
        const user = { _id: userId, bookedEvents: [] } as User;
        mockUserModel.findByIdAndUpdate.mockReturnValueOnce(Promise.resolve(user));
        await service.updateUserBookedEvents(userId, eventId, attendeesCount);

        expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should retrieve a user\'s booked events', async () => {
        const userId = '123';
        const bookedEvents = [
          { eventId: 'abc', attendeesCount: 1 },
          { eventId: 'def', attendeesCount: 2 },
        ];
      
        const user = { _id: userId, bookedEvents } as User;
        mockUserModel.findById.mockReturnValueOnce(Promise.resolve(user));
      
        const retrievedEvents = await service.getBookedEvents(userId);
        expect(retrievedEvents).toEqual(bookedEvents);
        expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
    });
    
    it('should cancel booking and update event availability', async () => {
        const userId = '123';
        const eventId = '456';
        const attendeesCount = 2;
      
        const bookedEvents = [{ eventId, attendeesCount }];
        const user = { _id: userId, bookedEvents } as User;
        const event = { _id: eventId, availableAttendeesCount: 10 } as Event;
      
        mockUserModel.findById.mockReturnValueOnce(Promise.resolve(user));
        mockEventModel.findByIdAndUpdate.mockReturnValueOnce(Promise.resolve(event));
        mockUserModel.findByIdAndUpdate.mockReturnValueOnce(Promise.resolve(user));
      
        const cancelledEvents = await service.cancelBooking(eventId, userId);
        expect(cancelledEvents).toEqual(bookedEvents);
      
        expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
        expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
          eventId,
          { $inc: { availableAttendeesCount: attendeesCount } },
          { new: true }
        );
      });  
});