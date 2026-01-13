import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { RefreshToken } from "src/auth/jwt/refresh.token.entity";
import { RenderMemberController } from "./render.member.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Member, RefreshToken])],
    controllers: [MemberController, RenderMemberController],
    providers: [MemberService],
    exports:[MemberService],
})
export class MemberModule {}