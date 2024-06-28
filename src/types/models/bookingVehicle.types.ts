import { UUID } from 'crypto';
import { Booking } from './booking.types';

export type BookingVehicle = {
  id: UUID;
  bookingId: UUID;
  vehicleType?: string;
  plateNumber?: string;
  registrationCountry?: string;
  createdAt: Date;
  updatedAt: Date;
  booking: Booking;
  vehiclesCount: number;
};
