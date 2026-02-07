import { Exclude } from "class-transformer";
import { RefreshToken } from "src/auth/jwt/refresh.token.entity";
import { Board } from "src/board/board.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({ type: 'datetime', nullable: true })
    passwordChangedAt: Date;

    @OneToMany(
        () => RefreshToken,
        (refreshToken) => refreshToken.member,
    )
    refreshTokens: RefreshToken[];

    @OneToMany(
        () => Board,
        (board) => board.member,
    )
    board: Board[]; 
}