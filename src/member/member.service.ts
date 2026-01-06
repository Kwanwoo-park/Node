import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { RequestMemberDto } from "./dto/request-member.dto";

@Injectable()
export class memberServie {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) {
    }

    async findAll(): Promise<Member[]> {
        return await this.memberRepository.find();
    }

    async findOne(id: number): Promise<Member> {
        const member = await this.memberRepository.findOne({ where: { id }});

        if (!member)
            throw new NotFoundException('Member not found');

        return member;
    }

    async create(createMemberDto: CreateMemberDto): Promise<Member> {
        const { password, ...result } = createMemberDto;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const member = this.memberRepository.create({
            ...result,
            password: hashedPassword,
        });

        return this.memberRepository.save(member);
    }

    async update(id: number, updateMemberDto: UpdateMemberDto): Promise<void> {
        const { password, ...result } = updateMemberDto;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        updateMemberDto = {
            ...result,
            password: hashedPassword,
        };

        await this.memberRepository.update(id, updateMemberDto);
    }

    async delete(id: number): Promise<void> {
        await this.memberRepository.delete(id);
    }

    async validateMember(requestMemberDto: RequestMemberDto): Promise<Member> {
        const { email, password } = requestMemberDto;
        const member = await this.memberRepository.findOneBy({ email });

        if (!member) throw new UnauthorizedException("가입하지 않은 이메일 입니다");

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) throw new UnauthorizedException("비밀번호가 틀렸습니다");

        return member;
    }
}