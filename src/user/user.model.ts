import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookedEvent } from './bookedEvent.model';

@Schema()
export class User extends Document {
  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, format: 'email' })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop()
  token?: string;

  @Prop({ type: [BookedEvent], ref: BookedEvent.name })
  bookedEvents: BookedEvent[];
}

export const UserSchema = SchemaFactory.createForClass(User);