
import { Category } from '../event.model';

export class EventResponseDTO {
    id: string;
    name: string;
    date: Date;
    availableAttendeesCount: number;
    description: string;
    category: Category;
}
