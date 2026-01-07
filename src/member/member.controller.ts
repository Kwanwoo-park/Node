import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, Request, UseGuards } from "@nestjs/common";
import { MemberService } from "./member.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";

@Controller('api/member')
export class MemberController {
    constructor(private readonly memberServie: MemberService) {}

    @Get()
    async findAll() {
        return this.memberServie.findAll();
    }

    @Get('/id')
    async findOne(@Param('id', ParseIntPipe) id: number,) {
        return this.memberServie.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/token')
    getMe(@Request() req) {
        return req.user;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMemberDto: CreateMemberDto,) {
        return this.memberServie.create(createMemberDto);
    }

    @Patch('/id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateMemberDto: UpdateMemberDto, ) {
        this.memberServie.update(id, updateMemberDto);
    }

    @Delete('/id')
    async delete(@Param('id', ParseIntPipe) id: number,) {
        this.memberServie.delete(id);
    }
}