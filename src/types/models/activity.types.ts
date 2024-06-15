import { UUID } from 'crypto';
import { Service } from './service.types';
import { ActivityRate } from './activityRate.types';

export type Activity = {
  id: UUID;
  name: string;
  serviceId: UUID;
  description?: string;
  disclaimer?: string;
  createdAt: Date;
  updatedAt: Date;
  service: Service;
  activityRates?: ActivityRate[];
};
