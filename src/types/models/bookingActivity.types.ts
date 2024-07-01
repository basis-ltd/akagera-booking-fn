import { UUID } from 'crypto';
import { Booking } from './booking.types';
import { Activity } from './activity.types';
import { BookingActivityPerson } from './bookingActivityPerson.types';

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
  numberOfAdults: number;
  numberOfChildren?: number;
  bookingActivityPeople?: BookingActivityPerson[];
  price: number | string;
};
