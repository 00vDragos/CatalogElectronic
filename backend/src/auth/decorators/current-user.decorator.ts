import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from '../types/authenticated-request.js';

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): JwtPayload => {
        const request = context.switchToHttp().getRequest();

        return request.user;
    },
);