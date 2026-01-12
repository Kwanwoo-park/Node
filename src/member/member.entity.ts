import { Exclude } from "class-transformer";
import { RefreshToken } from "src/auth/jwt/refresh.token.entity";
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

    @OneToMany(
        () => RefreshToken,
        (refreshToken) => refreshToken.member,
    )
    refreshTokens: RefreshToken[];
}