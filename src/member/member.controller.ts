import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { memberServie } from "./member.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { RequestMemberDto } from "./dto/request-member.dto";

@Controller('api/member')
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

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() requestMemberDto: RequestMemberDto, ) {
        return this.memberServie.validateMember(requestMemberDto);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMemberDto: CreateMemberDto,) {
        return this.memberServie.create(createMemberDto);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateMemberDto: UpdateMemberDto, ) {
        this.memberServie.update(id, updateMemberDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number,) {
        this.memberServie.delete(id);
    }
}