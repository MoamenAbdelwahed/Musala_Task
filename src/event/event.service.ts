import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRequestDTO } from './dto/request.dto';
import { Event } from './event.model';
import { EventResponseDTO } from './dto/response.dto';
import { TicketRequestDTO } from './dto/ticket.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {}

  async createEvent(event: EventRequestDTO): Promise<EventResponseDTO> {
    const newEvent = new this.eventModel(event);

    const savedEvent = await newEvent.save();
    return { ...savedEvent.toObject(), id: savedEvent._id.toString() };
  }

  async searchEvents(
    name?: string,
    startDate?: Date,
    endDate?: Date,
    category?: string,
  ): Promise<EventResponseDTO[]> {
    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }
    if (category) {
      query.category = category;
    }

    const events = await this.eventModel.find(query);
    return events.map((event) => ({
      ...event.toObject(),
      id: event._id.toString(),
    }));
  }

  async reserveTickets(eventId: string, ticketRequest: TicketRequestDTO): Promise<Event> {
    const event = await this.eventModel.findById(eventId);

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }

    if (ticketRequest.attendeesCount < 1) {
      throw new HttpException('Invalid attendees count. Minimum is 1.', HttpStatus.BAD_REQUEST);
    }

    if (event.availableAttendeesCount < ticketRequest.attendeesCount) {
      throw new HttpException('Insufficient available tickets', HttpStatus.BAD_REQUEST);
    }

    event.availableAttendeesCount -= ticketRequest.attendeesCount;
    await event.save();

    return event;
  }

  async findUpcomingEvents(): Promise<Event[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + 1);
    return this.eventModel.find({ date: { $gt: thresholdDate }, notificationSent: false });
  }
}
