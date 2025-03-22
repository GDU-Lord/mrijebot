import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { GameSystem } from "./game-system.entity";

export type UserDiscoverySource = 'telegram' | 'email';
export type UserDurationPreference = 'one_shot' | 'short_campaign' | 'long_campaign';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  telegramId!: number;

  @Column('varchar')
  email!: string;

  @Column('boolean')
  isGlobalAdmin!: boolean;

  @OneToMany(() => Member, member => member.user)
  memberships!: Member[];

  @Column('varchar')
  city!: string;

  @Column('varchar')
  discoverySource!: UserDiscoverySource;

  @Column('int')
  playerGamesPlayed!: number;

  @ManyToMany(() => GameSystem)
  @JoinTable()
  playerPreferredGameSystems!: GameSystem[];

  @Column('simple-array')
  playerPreferredDuration!: UserDurationPreference[];

  @Column('int')
  masterGamesPlayed!: number;

  @ManyToMany(() => GameSystem)
  @JoinTable()
  masterPreferredGameSystems!: GameSystem[];

  @Column('simple-array', { nullable: true })
  masterPreferredDuration!: UserDurationPreference[];
}