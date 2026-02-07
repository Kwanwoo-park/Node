import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./board.entity";
import { Repository } from "typeorm";
import { Member } from "src/member/member.entity";
import { CreateBoardDto } from "./dto/create-board.dto";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async save(createDto: CreateBoardDto, member: Member) {
        const { description, url } = createDto;

        const board = this.boardRepository.create({
            description: description,
            url: url,
            member: member,
        });

        return this.boardRepository.save(board);
    }

    async find(member: Member) {
        const boards = await this.boardRepository.find({
            where: { member: member },
            relations: ['member'],
        });

        console.log(boards)

        return boards;
    }
}