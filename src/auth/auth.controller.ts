import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() requestMemberDto: RequestMemberDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(requestMemberDto, res);
    }

    @Post('/refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) throw new UnauthorizedException();

        try {
            const payload = this.jwtService.verify(refreshToken);

            if (payload.type !== 'refresh') throw new UnauthorizedException();

            const newAccessToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '1m' },
            );

            res.cookie('access_token', newAccessToken, {
               httpOnly: true,
               sameSite: 'lax',
               secure: true, 
            });

            return { message: 'access token refreshed' };
        } catch {
            throw new UnauthorizedException();
        }
    }
}
