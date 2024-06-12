import { UUID } from 'crypto';
import { Activity } from './activity.types';

export type Service = {
  id: UUID;
  name: string;
  serviceId: UUID;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  activities: Activity[];
};
