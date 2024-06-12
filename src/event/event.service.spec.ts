import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { EventService } from './event.service';
import { Category, Event, EventSchema } from './event.model';
import { TicketRequestDTO } from './dto/ticket.dto';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

const mockEventModel = {
  new: jest.fn(),
  constructor: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
};

describe('EventService', () => {
  let service: EventService;
  let model: Model<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: process.env.MONGO_TEST_URI
          }),
        }),
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
      ],
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reserve tickets with sufficient availability', async () => {
    const event = {
      name: 'Test Event',
      date: new Date(),
      category: Category.Game,
      availableAttendeesCount: 10,
      save: jest.fn()
    };
  
    const ticketRequest: TicketRequestDTO = { attendeesCount: 5 };
  
    mockEventModel.findById.mockReturnValueOnce(Promise.resolve(event));
    mockEventModel.save.mockReturnValueOnce(Promise.resolve(event));
  
    await service.reserveTickets('123', ticketRequest);
  
    expect(event.availableAttendeesCount).toBe(5);
    expect(event.save).toHaveBeenCalled();
  });
  
  it('should find upcoming events', async () => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + 1);
  
    const upcomingEvents = [
      { name: 'Event 1', date: new Date(thresholdDate.getTime() + 1000), notificationSent: false },
      { name: 'Event 2', date: new Date(thresholdDate.getTime() + 2000), notificationSent: true },
    ];
  
    mockEventModel.find.mockReturnValueOnce(Promise.resolve(upcomingEvents));
  
    const retrievedEvents = await service.findUpcomingEvents();
  
    expect(retrievedEvents.length).toBeGreaterThan(0);
  });  
});