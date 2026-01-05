import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "./member.entity";
import { Repository } from "typeorm";
import { CreateMemberDto } from "./dto/create-member.dto";

@Injectable()
export class memberServie {
    constructor(
        @InjectRepository(Member)
        private memberRepository: Repository<Member>,
    ) {}

    async findAll(): Promise<Member[]> {
        return this.memberRepository.find();
    }

    async findOne(id: number): Promise<Member> {
        const member = await this.memberRepository.findOne({ where: { id }});

        if (!member)
            throw new NotFoundException('Member not found');

        return member;
    }

    async create(createMemberDto: CreateMemberDto): Promise<Member> {
        const member = this.memberRepository.create(createMemberDto);
        return this.memberRepository.save(member);
    }
}