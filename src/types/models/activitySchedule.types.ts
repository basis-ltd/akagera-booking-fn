import { UUID } from "crypto";
import { Activity } from "./activity.types";

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
