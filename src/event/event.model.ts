import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength, MinLength, isBoolean } from 'class-validator';
import { Document } from 'mongoose';

export enum Category {
  Concert = 'Concert',
  Conference = 'Conference',
  Game = 'Game',
}

@Schema()
export class Event extends Document {
  @Prop({ required: true, maxlength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @Prop({ required: true, min: 1, max: 1000 })
  @IsNotEmpty()
  @IsInt()
  availableAttendeesCount: number;

  @Prop({ required: true, maxlength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

  @IsBoolean()
  notificationSent: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
