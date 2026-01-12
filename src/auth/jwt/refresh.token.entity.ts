import { Member } from "src/member/member.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(
        () => Member,
        (member) => member.refreshTokens,
        {
            onDelete: 'CASCADE',
        }
    )
    member: Member;
}