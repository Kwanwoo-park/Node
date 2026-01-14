import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { MemberService } from "./member.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { JwtApiGuard } from "src/auth/jwt/jwt-api.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "src/auth/jwt/refresh.token.entity";
import { Repository } from "typeorm";
import type { Response } from "express";

@Controller('api/member')
export class MemberController {
    constructor(
        private readonly memberServie: MemberService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenReop: Repository<RefreshToken>,
    ) {}

    @Get()
    async findAll() {
        return this.memberServie.findAll();
    }

    @Get('/id')
    async findOne(@Param('id', ParseIntPipe) id: number,) {
        return this.memberServie.findOne(id);
    }

    @UseGuards(JwtApiGuard)
    @Get('/token')
    @HttpCode(HttpStatus.OK)
    getMe(@Request() req) {
        return req.user;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMemberDto: CreateMemberDto,) {
        return this.memberServie.create(createMemberDto);
    }

    @UseGuards(JwtApiGuard)
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateMemberDto: UpdateMemberDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        this.memberServie.update(id, updateMemberDto);
        this.refreshTokenReop.delete({
            member: { id },
        });
        
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }

    @Delete('/id')
    async delete(@Param('id', ParseIntPipe) id: number,) {
        this.memberServie.delete(id);
    }
}