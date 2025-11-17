import { Request } from 'express';
import { User } from './user.types';
export type AuthenticatedRequest = Request & {
    user?: User;
};
