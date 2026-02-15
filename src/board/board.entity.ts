import { Member } from "src/member/member.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 45 })
    description: string;

    @Column()
    imgSrc: string;

    @Column()
    url: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
        () => Member,
        (member) => member.board,
        {
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn({ name: 'memberId' })
    member: Member;
}