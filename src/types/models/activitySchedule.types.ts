import { UUID } from "crypto";
import { Activity } from "./activity.types";
import { User } from "./user.types";

export type ActivitySchedule = {
  id: UUID;
  activityId: UUID;
  activity?: Activity;
  description?: string;
  disclaimer?: string;
  minNumberOfSeats?: number;
  maxNumberOfSeats?: number;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  numberOfSeats: number;
  updatedAt: Date;
};

export type SeatsAdjustment = {
  id: UUID;
  activityScheduleId: UUID;
  reason?: string;
  adjustedSeats: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}
