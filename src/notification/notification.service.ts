import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "src/event/event.model";
import { User } from "src/user/user.model";
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Event.name) private eventModel: Model<Event>
    ) {}

    async sendNotification(user: User, event: Event) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
    
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: `Upcoming Event: ${event.name}`,
          text: `Hi ${user.name},
                  This is a friendly reminder that you have an upcoming event: ${event.name} on ${event.date.toLocaleDateString()}.
    
                  We hope you're excited!
    
                  Best regards,
                  The Event Team`,
        };
    
        const info = await transporter.sendMail(mailOptions);
    
        console.log(`Email notification sent for event: ${event.name} to user: ${user.email}`);
      }
}
