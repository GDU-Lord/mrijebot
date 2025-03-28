import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Land } from "./land.entity";

export type MemberStatus = 'guest' | 'participant';

// @Entity()
export class Member {
  // @PrimaryGeneratedColumn()
  id!: number;

  // @Column('int')
  userId!: number;

  // @ManyToOne(() => User, (user) => user.memberships)
  user!: User;

  // @Column('int')
  landId!: number;

  // @ManyToOne(() => Land, (user) => user.members)
  land!: Land;

  // @Column('varchar')
  status!: MemberStatus;

  // @Column('boolean')
  isLandAdmin!: boolean;
}