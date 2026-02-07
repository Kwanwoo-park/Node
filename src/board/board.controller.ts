import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { BoardService } from "./board.service";
import { MemberService } from "src/member/member.service";
import { CreateBoardDto } from "./dto/create-board.dto";

@Controller('api/board')
export class BoardController {
    constructor(
        private readonly boardService: BoardService,
        private readonly memberService: MemberService,
    ) {}

    @Get("/view/:id")
    @HttpCode(HttpStatus.OK)
    async getAll(@Param('id', ParseIntPipe) id: number) {
        const member = await this.memberService.findOne(id);

        return this.boardService.find(member);
    }

    @Post('/create/:id')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createDto: CreateBoardDto, @Param('id', ParseIntPipe) id: number) {
        const member = await this.memberService.findOne(id);
        const board = await this.boardService.save(createDto, member);

        return board;
    }
}