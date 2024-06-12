import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class AuditLog extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  @IsDate()
  timestamp: Date;

  @Prop()
  eventId?: string;

  @Prop()
  userId?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);