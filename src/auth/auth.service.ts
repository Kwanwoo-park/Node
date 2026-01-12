import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import { Member } from 'src/member/member.entity';
import * as bcrypt from "bcrypt";
import { MemberService } from 'src/member/member.service';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './jwt/refresh.token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private memberService: MemberService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokenRepo: Repository<RefreshToken>,
    ) {}

    private async validateMember(email: string, password: string): Promise<Member> {
        const member = await this.memberService.findByEmail(email);

        if (!member) throw new UnauthorizedException("가입하지 않은 이메일 입니다");

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) throw new UnauthorizedException("비밀번호가 틀렸습니다");

        return member;
    }

    async login(requestMemberDto: RequestMemberDto, res: Response) {
        const { email, password } = requestMemberDto;
        const member = await this.validateMember(email, password);

        const accessToken = this.jwtService.sign(
            { sub: member.id, email: member.email },
            { expiresIn: '15m' },
        );

        const refreshToken = this.jwtService.sign(
            { sub: member.id, email: member.email , type: 'refresh' },
            { expiresIn: '7d' },
        );

        const tokenHash = await bcrypt.hash(refreshToken, 10);

        await this.refreshTokenRepo.save({
            userId: member.id,
            tokenHash,
            member,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { message: 'login success' };
    }

    async refreshAccessToken(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);
        if (payload.type !== 'refresh') throw new UnauthorizedException();

        const tokens = await this.refreshTokenRepo.find({
            where: { userId: payload.sub },
            relations: ['member'],
        });

        const matched = await Promise.any(
            tokens.map(t => bcrypt.compare(refreshToken, t.tokenHash))
        ).catch(() => null);

        const newAccessToken = this.jwtService.sign(
            { sub: payload.sub, email: payload.email },
            { expiresIn: '15m' },
        );

        return newAccessToken;
    }
}
