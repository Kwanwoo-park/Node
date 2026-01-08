import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestMemberDto } from 'src/member/dto/request-member.dto';
import { Member } from 'src/member/member.entity';
import * as bcrypt from "bcrypt";
import { MemberService } from 'src/member/member.service';

@Injectable()
export class AuthService {
    constructor(
        private memberService: MemberService,
        private jwtService: JwtService,
    ) {}

    private async validateMember(email: string, password: string): Promise<Member> {
        const member = await this.memberService.findByEmail(email);

        if (!member) throw new UnauthorizedException("가입하지 않은 이메일 입니다");

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) throw new UnauthorizedException("비밀번호가 틀렸습니다");

        return member;
    }

    async login(requestMemberDto: RequestMemberDto) {
        const { email, password } = requestMemberDto;
        const member = await this.validateMember(email, password);

        const payload = {
            sub: member.id,
            email: member.email,
        };

        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
