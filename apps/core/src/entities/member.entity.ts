import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Land } from "./land.entity";
import { Role } from "./role.entity";

export type MemberStatus = 'guest' | 'participant';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  userId!: number;

  @ManyToOne(() => User, user => user.memberships)
  user!: User;

  @Column('int')
  landId!: number;

  @ManyToOne(() => Land, land => land.members)
  land!: Land;

  @Column('varchar')
  status!: MemberStatus;

  @Column('boolean')
  isLandAdmin!: boolean;

  @ManyToMany(() => Role)
  @JoinTable()
  localRoles!: Role[];
}