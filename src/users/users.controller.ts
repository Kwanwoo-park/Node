import { Body, Controller, Delete, Get, Header, HostParam, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Redirect, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import type { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    private users: User[] = [
        { id: 1, name: '홍길동', email: 'hong@example.com', age: 30 },
        { id: 2, name: '김철수', email: 'kim@example.com', age: 25 },
    ];

    @Get()
    findAll(@Query('name') name?: string): User[] {
        if (name) {
            return this.users.filter(user => user.name.includes(name));
        }

        return this.users;
    }

    @Get(':id')
    findOne(@Param('id') id: string): User {
        const user = this.users.find(user => user.id === Number(id));

        if (!user) {
            throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): User {
        const newUser: User = {
            id: this.users.length + 1,
            ...createUserDto,
        };

        this.users.push(newUser);
        return newUser;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
        const userIndex = this.users.findIndex(user => user.id === Number(id));

        if (userIndex === -1) {
            throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateUserDto,
        }

        return this.users[userIndex];
    }

    @Delete(':id')
    remove(@Param('id') id: string): { message: string } {
        const userIndex = this.users.findIndex(user => user.id === Number(id));

        if (userIndex === -1) {
            throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
        }

        this.users.splice(userIndex, 1);
        return { message: `User with ID ${id} removed successfully` };
    }
}
