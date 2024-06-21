import { UUID } from "crypto"
import { BookingPerson } from "./bookingPerson.types";

export type BookingActivityPerson = {
    id: UUID;
    bookingActivityId: UUID;
    bookingPersonId: UUID;
    createdAt: Date;
    updatedAt: Date;
    bookingPerson: BookingPerson;
}