import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() requestMemberDto: RequestMemberDto, ) {
        return this.authService.login(requestMemberDto);
    }
}
