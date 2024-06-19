import { UUID } from 'crypto';
import { Activity } from './activity.types';

export type ActivityRate = {
  id: UUID;
  name: string;
  description?: string;
  disclaimer?: string;
  activityId: UUID;
  amountUsd: number | string;
  amountRwf?: number | string;
  createdAt: Date;
  updatedAt: Date;
  activity: Activity;
  ageRange: string;
};
