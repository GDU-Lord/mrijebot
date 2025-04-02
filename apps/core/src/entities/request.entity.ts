import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";
import { Member } from "./member.entity";
import { Land } from "./land.entity";

export type requestStatus = "open" | "in_progress" | "fulfilled" | "rejected";

@Entity()
export class Request {
  
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  tag!: string;

  @Column("varchar")
  status!: requestStatus;

  @Column("text", { nullable: true })
  content!: string | null;


  @ManyToOne(() => User, { nullable: true })
  fromUser!: User | null;

  @ManyToOne(() => Role, { nullable: true })
  fromRole!: Role | null;

  @ManyToOne(() => Member, { nullable: true })
  fromMember!: Member | null;

  @ManyToOne(() => Land, { nullable: true })
  fromLand!: Land | null;


  @ManyToOne(() => Role, { nullable: true })
  toRole!: Role | null;

  @ManyToOne(() => User, { nullable: true })
  toUser!: User | null;

  @ManyToOne(() => Member, { nullable: true })
  toMember!: Member | null;

  @ManyToOne(() => Land, { nullable: true })
  toLand!: Land | null;

  
  @ManyToMany(() => User)
  @JoinTable()
  signatures!: User[];

}