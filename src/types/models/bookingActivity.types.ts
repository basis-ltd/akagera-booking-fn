import { UUID } from 'crypto';
import { Booking } from './booking.types';
import { Activity } from './activity.types';

export type BookingActivity = {
  id: UUID;
  bookingId: UUID;
  activityId: UUID;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  activity: Activity;
  booking: Booking;
  numberOfPeople: number | string;
};
