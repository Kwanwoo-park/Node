import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Member } from "src/member/member.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Member)
        private readonly memberRepo: Repository<Member>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const member = await this.memberRepo.findOneBy({
            id: payload.sub,
        });

        if (!member) {
            throw new UnauthorizedException();
        }

        if (member.passwordChangedAt && payload.pwdAt < member.passwordChangedAt.getTime()) {
            throw new UnauthorizedException('Password has been changed');
        }

        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}