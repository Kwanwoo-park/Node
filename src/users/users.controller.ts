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

    // private users: User[] = [
    //     { id: 1, name: '홍길동', email: 'hong@example.com', age: 30 },
    //     { id: 2, name: '김철수', email: 'kim@example.com', age: 25 },
    // ];

    // @Get()
    // findAll(@Query('name') name?: string): User[] {
    //     if (name) {
    //         return this.users.filter(user => user.name.includes(name));
    //     }

    //     return this.users;
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string): User {
    //     const user = this.users.find(user => user.id === Number(id));

    //     if (!user) {
    //         throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    //     }

    //     return user;
    // }

    // @Post()
    // create(@Body() createUserDto: CreateUserDto): User {
    //     const newUser: User = {
    //         id: this.users.length + 1,
    //         ...createUserDto,
    //     };

    //     this.users.push(newUser);
    //     return newUser;
    // }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User {
    //     const userIndex = this.users.findIndex(user => user.id === Number(id));

    //     if (userIndex === -1) {
    //         throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    //     }

    //     this.users[userIndex] = {
    //         ...this.users[userIndex],
    //         ...updateUserDto,
    //     }

    //     return this.users[userIndex];
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string): { message: string } {
    //     const userIndex = this.users.findIndex(user => user.id === Number(id));

    //     if (userIndex === -1) {
    //         throw new HttpException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND);
    //     }

    //     this.users.splice(userIndex, 1);
    //     return { message: `User with ID ${id} removed successfully` };
    // }
}
