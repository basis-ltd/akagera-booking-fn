import { UUID } from "crypto";
import { Activity } from "./activity.types";

export type ActivitySchedule = {
  id: UUID;
  activityId: UUID;
  activity?: Activity;
  description?: string;
  disclaimer?: string;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  numberOfSeats: number;
  updatedAt: Date;
};
