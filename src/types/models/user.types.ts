import { UUID } from 'crypto';

export type User = {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  role: 'receptionist' | 'admin' | 'superadmin' | 'client' | 'guest';
  password: string;
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth?: Date;
  nationality?: string;
  residence?: string;
  gender?: string;
  photo?: string;
};
