import { UUID } from "crypto";
import { Activity } from "./activity.types";

export type Booking = {
    id: UUID;
<<<<<<< HEAD
    startDate: Date;
    notes?: Text;
    status: string;
    endDate?: Date;
    createdBy: string;
    date: Date;
=======
    startDate: Date | string;
    notes?: Text;
    status: string;
    endDate?: Date | string;
    createdBy: string;
    date: Date | string;
>>>>>>> 8f53be0 (feature (deployment))
    totalAmountUsd?: number;
    totalAmountRwf?: number;
    discountedAmountUsd?: number;
    discountedAmountRwf?: number;
<<<<<<< HEAD
    checkIn?: Date;
    checkOut?: Date;
    createdAt: Date;
    updatedAt: Date;
    activities: Activity[];
    approvedBy?: UUID;
    approvedAt?: Date;
=======
    checkIn?: Date | string;
    checkOut?: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
    activities: Activity[];
    approvedBy?: UUID;
    approvedAt?: Date | string;
>>>>>>> 8f53be0 (feature (deployment))
    approvedByUser?: string;
    referenceId?: string;
    name: string;
};
