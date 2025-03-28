import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

// @Entity()
export class Land {
  // @PrimaryGeneratedColumn()
  id!: number;

  // @Column('varchar')
  name!: string;

  // @Column('varchar')
  region!: string;

  // @OneToMany(() => Member, member => member.user)
  members!: Member[];
}