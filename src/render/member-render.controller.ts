import { Controller, Get, Render } from "@nestjs/common";

@Controller()
export class MemberRenderController {
    @Get('/login')
    @Render('login')
    login() {
        return;
    }
}