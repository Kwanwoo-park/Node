import { Body, Controller, Delete, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import type { Request, Response } from 'express';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './jwt/refresh.token.entity';
import { Repository } from 'typeorm';
import { JwtApiGuard } from './jwt/jwt-api.guard';

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

    @UseGuards(JwtApiGuard)
    @Delete('/logout')
    async logout(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        const userId = req.user.userId;
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken)
            throw new UnauthorizedException();

        const tokens = await this.refreshTokenReop.find({
            where: { member: { id: userId } },
        });

        let matchedToken: RefreshToken | null = null;

        for (const t of tokens) {
            const ok = await bcrypt.compare(refreshToken, t.tokenHash);
            
            if (ok) {
                matchedToken = t;
                break;
            }
        }
        
        if (!matchedToken)
            throw new UnauthorizedException();

        await this.refreshTokenReop.delete(matchedToken.id);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'logout' };
    }

    @Delete('/all/logout')
    async allLogout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refresh_token;
        
        if (refreshToken) {
            const payload = this.jwtService.decode(refreshToken) as any;

            await this.refreshTokenReop.delete({
                member: { id: payload.sub },
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
            const newAccessToken = this.authService.refreshAccessToken(refreshToken);

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
