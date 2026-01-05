import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { MemberController } from "./member.controller";
import { memberServie } from "./member.service";

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    controllers: [MemberController],
    providers: [memberServie],
})
export class MemberModule {}