import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Member } from "./member.entity";

export type roleType = "local" | "global" | "hybrid";
export type roleStatus = "role" | "position";

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  tag!: string;

  @Column('varchar')
  type!: roleType;

  @Column('varchar')
  status!: roleStatus;

  @Column('varchar', { nullable: true })
  name!: string | null;

  @Column('varchar', { nullable: true })
  publicName!: string | null;

  @Column('varchar', { nullable: true })
  shortName!: string | null;

  @Column('varchar', { nullable: true })
  shortPublicName!: string | null;

  @Column('varchar', { nullable: true })
  link!: string | null;

  @Column('int', { nullable: true })
  rank!: number | null;

  // @ManyToMany(() => User)
  // @JoinTable()
  // users!: User[];

  // @ManyToMany(() => Member)
  // @JoinTable()
  // members!: Member[];

}