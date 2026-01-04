import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userSerivce: UsersService) {}

    @Get()
    findAll() {
        return this.userSerivce.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userSerivce.findOne(+id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto){
        return this.userSerivce.create(createUserDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userSerivce.update(+id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string) {
        this.userSerivce.delete(+id);
    }
}
