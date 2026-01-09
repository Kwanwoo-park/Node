import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import type { Request, Response } from 'express';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './jwt/refresh.token.entity';
import { Repository } from 'typeorm';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokenReop: Repository<RefreshToken>,
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() requestMemberDto: RequestMemberDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(requestMemberDto, res);
    }

    @Delete('/logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        
        if (refreshToken) {
            const payload = this.jwtService.decode(refreshToken) as any;

            await this.refreshTokenReop.delete({
                userId: payload.sub,
            });
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'logout' };
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

            const tokens = await this.refreshTokenReop.find({
                where: { userId: payload.sub },
            });

            const matched = await Promise.any(
                tokens.map(t => bcrypt.compare(refreshToken, t.tokenHash))
            ).catch(() => null);

            const newAccessToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '15m' },
            );

            res.cookie('access_token', newAccessToken, {
               httpOnly: true,
               sameSite: 'lax',
               secure: true, 
               maxAge: 15 * 60 * 1000,
            });

            return { message: 'access token refreshed' };
        } catch {
            throw new UnauthorizedException();
        }
    }
}
