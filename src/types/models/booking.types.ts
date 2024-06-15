import { UUID } from "crypto";
import { Activity } from "./activity.types";

export type Booking = {
    id: UUID;
    startDate: Date;
    notes?: Text;
    status: string;
    endDate?: Date;
    createdBy: string;
    date: Date;
    totalAmountUsd?: number;
    totalAmountRwf?: number;
    discountedAmountUsd?: number;
    discountedAmountRwf?: number;
    checkIn?: Date;
    checkOut?: Date;
    createdAt: Date;
    updatedAt: Date;
    activities: Activity[];
    approvedBy?: UUID;
    approvedAt?: Date;
    approvedByUser?: string;
    referenceId?: string;
};
