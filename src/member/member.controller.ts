import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { memberServie } from "./member.service";
import { CreateMemberDto } from "./dto/create-member.dto";

@Controller('member')
export class MemberController {
    constructor(private readonly memberServie: memberServie) {}

    @Get()
    async findAll() {
        return this.memberServie.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number,) {
        return this.memberServie.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMemberDto: CreateMemberDto,) {
        return this.memberServie.create(createMemberDto);
    }
}