import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import { MemberService } from "./member.service";
import { JwtPageGuard } from "src/auth/jwt/jwt-page.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/auth/jwt/refresh.token.entity";
import { Repository } from "typeorm";

@Controller()
export class RenderMemberController {
    constructor(
        private readonly memberService: MemberService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenReop: Repository<RefreshToken>,
    ) {}

    @Get('/login')
    @Render('login')
    login() {
        return;
    }

    @UseGuards(JwtPageGuard)
    @Get('/home')
    @Render('home')
    async home(@Req() request) {        
        return {
            member: await this.memberService.findOne(request.user.userId),
            list: await this.refreshTokenReop.find({
                where: { member: { id: request.user.userId } },
            }),
        };
    }
}