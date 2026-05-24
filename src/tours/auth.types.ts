import { Request } from 'express';
import { Role } from './role.enum';

export interface AuthUser {
  role: Role;
}

export type AuthRequest = Request & {
  user?: AuthUser;
};
