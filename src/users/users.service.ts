import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SafeUser, User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private users: User[] = [];
    private nextId = 1;

    findAll(): SafeUser[] {
        return this.users.map(user => this.sanitizeUser(user));
    }

    findOne(id: number): SafeUser {
        const user = this.users.find(user => user.id === id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.sanitizeUser(user);
    }

    findByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }

    findByEmail(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    create(createUserDto: CreateUserDto): SafeUser {
        const existingUserName = this.findByUsername(createUserDto.username);

        if (existingUserName) {
            throw new ConflictException(`Username ${createUserDto.username} already exists`);
        }

        const existingEmail = this.findByEmail(createUserDto.email);

        if (existingEmail) {
            throw new ConflictException(`Email ${createUserDto.email} already exists`);
        }

        const newUser: User = {
            id: this.nextId++,
            ...createUserDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.users.push(newUser);

        return this.sanitizeUser(newUser);
    }

    update(id: number, updateUserDto: UpdateUserDto): SafeUser {
        const userIndex = this.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateUserDto.email && updateUserDto.email !== this.users[userIndex].email) {
            const existingEmail = this.findByEmail(updateUserDto.email);

            if (existingEmail) {
                throw new ConflictException(`Email ${updateUserDto.email} already exists`);
            }
        }

        if (updateUserDto.username && updateUserDto.username !== this.users[userIndex].username) {
            const existingUserName = this.findByUsername(updateUserDto.username);

            if (existingUserName) {
                throw new ConflictException(`Username ${updateUserDto.username} already exists`);
            }
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateUserDto,
            updatedAt: new Date(),
        };

        return this.sanitizeUser(this.users[userIndex]);
    }

    delete(id: number): void {
        const userIndex = this.users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.users.splice(userIndex, 1);
    }

    private sanitizeUser(user: User): SafeUser {
        const { password, ...result } = user;
        return result;
    }
}
