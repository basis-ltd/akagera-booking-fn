import { UUID } from 'crypto';
import { Service } from './service.types';
import { ActivityRate } from './activityRate.types';
import { ActivitySchedule } from './activitySchedule.types';

export type Activity = {
  id: UUID;
  name: string;
  serviceId: UUID;
  description?: string;
  disclaimer?: string;
  createdAt: Date;
  updatedAt: Date;
  startTime: Date;
  endTime?: Date;
  service: Service;
  activityRates?: ActivityRate[];
  activitySchedules?: ActivitySchedule[];
};
