import { UUID } from "crypto";
import { Booking } from "./booking.types";

export type BookingPerson = {
    id: UUID;
    name: string;
    email: string;
    nationality?: string;
    residence?: string
    phone?: string
    createdAt: Date;
    updatedAt: Date;
    bookingId: UUID;
    booking?: Booking;
    gender?: string;
    dateOfBirth: Date;
    startDate: Date;
    endDate: Date;
    age?: number;
    numberOfDays?: number;
};
