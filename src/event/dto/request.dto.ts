import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, Max, MaxLength, Min} from 'class-validator';
import { Category } from '../event.model';

export class EventRequestDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  availableAttendeesCount: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;
}
