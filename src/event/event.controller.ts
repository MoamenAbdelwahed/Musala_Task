import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Headers, HttpException, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { EventRequestDTO } from './dto/request.dto';
import { UserService } from 'src/user/user.service';
import { EventResponseDTO } from './dto/response.dto';
import { Event } from './event.model';
import { TicketRequestDTO } from './dto/ticket.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService, 
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEvent(
    @Body() event: EventRequestDTO,
    @Headers('Authorization') authorization: string,
  ): Promise<EventResponseDTO> {
    await this.authService.authentication(authorization);

    return await this.eventService.createEvent(event);
  }

  @Get()
  async searchEvents(
    @Query('name') name?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
  ): Promise<EventResponseDTO[]> {
    const isValidStartDate = startDate && /\d{4}-\d{2}-\d{2}/.test(startDate);
    const parsedStartDate = isValidStartDate ? new Date(startDate) : undefined;

    const isValidEndDate = endDate && /\d{4}-\d{2}-\d{2}/.test(endDate);
    const parsedEndDate = isValidEndDate ? new Date(endDate) : undefined;
    return await this.eventService.searchEvents(name, parsedStartDate, parsedEndDate, category);
  }

  @Post('/:eventId/tickets')
  @HttpCode(HttpStatus.CREATED)
  async reserveTickets(
        @Param('eventId') eventId: string, 
        @Body() ticketRequest: TicketRequestDTO,
        @Headers('Authorization') authorization: string,
    ): Promise<Event> {
    const user = await this.authService.authentication(authorization);
    const event = await this.eventService.reserveTickets(eventId, ticketRequest);
    await this.userService.updateUserBookedEvents(user._id.toString(), eventId, ticketRequest.attendeesCount);
    return event;
  }
}
