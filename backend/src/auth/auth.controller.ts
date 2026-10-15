import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { JwtPayload } from './types/authenticated-request.js';
import { CurrentUser } from './decorators/current-user.decorator.js';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Login with email and password' })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({ summary: 'Get current authenticated user' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user: JwtPayload) {
        return user;
    }


}