import { UUID } from 'crypto';
import { User } from './user.types';

export type Settings = {
  id: UUID;
  usdRate: number;
  user: User;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
};
