import { Controller, Get, Render } from "@nestjs/common";

@Controller()
export class RenderMemberController {
    @Get('/login')
    @Render('login')
    login() {
        return;
    }
}