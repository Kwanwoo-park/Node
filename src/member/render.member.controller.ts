import { Controller, Get, Render, Req, UseGuards } from "@nestjs/common";
import { MemberService } from "./member.service";
import { JwtPageGuard } from "src/auth/jwt/jwt-page.guard";

@Controller()
export class RenderMemberController {
    constructor(private readonly memberService: MemberService) {}

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
            member: await this.memberService.findOne(request.user.userId)
        };
    }
}