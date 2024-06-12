import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class BookedEvent extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @Prop({ required: true, min: 1, max: 1000 })
  @IsNotEmpty()
  @IsInt()
  attendeesCount: number;
}

export const BookedEventSchema = SchemaFactory.createForClass(BookedEvent);
