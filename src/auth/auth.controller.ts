import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import type { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() requestMemberDto: RequestMemberDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken } = await this.authService.login(requestMemberDto);
        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60,
        });

        return { message: 'login sucess' };
    }
}
