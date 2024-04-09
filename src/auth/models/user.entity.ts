import { Role } from './role.enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('User')
export class UserEntity {
    @PrimaryColumn()
    id: string

    @Column({ unique: true })
    email: string

    @Column({ nullable: false })
    password: string

    @Column()
    name: string

    @Column({ length: 500 })
    phone: string

    @Column({ nullable: true })
    imagePath: string

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}