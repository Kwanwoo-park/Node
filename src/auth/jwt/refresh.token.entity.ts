import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    tokenHash: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}