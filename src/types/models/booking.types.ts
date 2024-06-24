import { UUID } from "crypto";
import { Activity } from "./activity.types";

export type Booking = {
    id: UUID;
    startDate: Date | string;
    notes?: Text;
    status: string;
    endDate?: Date | string;
    phone?: string;
    email?: string;
    date: Date | string;
    totalAmountUsd?: number;
    totalAmountRwf?: number;
    discountedAmountUsd?: number;
    discountedAmountRwf?: number;
    checkIn?: Date | string;
    checkOut?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    activities: Activity[];
    approvedBy?: UUID;
    approvedAt?: Date | string;
    approvedByUser?: string;
    referenceId?: string;
    name: string;
    type: string;
};
