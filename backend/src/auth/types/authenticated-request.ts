import type { Request } from 'express';

export interface JwtPayload {
    sub: number;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}