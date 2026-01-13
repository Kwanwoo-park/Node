import { Member } from "src/member/member.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    tokenHash: string;

    @Column({ length: 200 })
    userAgent: string;

    @Column({ length: 45 })
    ipAddress: string;

    @Column({ type: 'timestamp' })
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