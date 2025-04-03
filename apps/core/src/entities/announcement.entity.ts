import { IsEnum } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export type announcementType = "local" | "global" | "game" | "private";
export type announcementStatus = "pending" | "edit" | "sent" | "archived";

@Entity()
export class Announcement {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  tag!: announcementType;

  @ManyToOne(() => User, user => user.announcements, { nullable: true })
  owner!: User | null;

  @Column('timestamp')
  date: Date;

  @Column('varchar')
  status: announcementStatus;


  @Column("int", { array: true})
  landIds!: number[];

  @Column("int", { array: true})
  roleIds!: number[];

  @Column("int", { array: true})
  userIds!: number[];

  @Column("int", { array: true})
  memberIds!: number[];


  @Column("jsonb", { nullable: true })
  data!: Record<string, any> | null;

  @Column("text")
  text!: string;


  @Column("bigint", { array: true })
  recepientIds: string[];

  @Column("bigint", { array: true })
  instanceIds: string[];

}

// - date: string
// - owner: User | null
// - tag: "local" | "global" | "game" | "private"
// - landIds: number[]
// - roleIds: number[]
// - userIds: number[]
// - memberIds: number[]
// - data: string // json
// - text: string
// - images: string[]
// - messageIds: number[]
// - telegramIds: number[]