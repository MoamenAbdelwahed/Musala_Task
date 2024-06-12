import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog } from "./auditLog.model";

@Injectable()
export class AuditLogService {
    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    ) {}

    async createLog(message: string, eventId?: string, userId?: string) {
        const newLog = new this.auditLogModel({
          message,
          timestamp: new Date(),
          eventId,
          userId
        });
        return newLog.save();
      }
}
