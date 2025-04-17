import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Land } from "./land.entity";

@Entity()
export class Chat {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("bigint")
  chatId!: string;

  @Column("varchar")
  title!: string;

  @Column("varchar")
  invite!: string;

  @Column("text", { nullable: true })
  description!: string | null;

  @ManyToOne(() => Land, { nullable: true })
  land!: Land | null;

  @ManyToMany(() => User)
  @JoinTable()
  users!: User[];

}