import { IsInt, IsNotEmpty } from "class-validator";

export class TicketRequestDTO {
    @IsNotEmpty()
    @IsInt()
    attendeesCount: number;
}