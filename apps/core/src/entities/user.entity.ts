import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";
import { GameSystem } from "./game-system.entity";

export type UserDiscoverySource = 'instagram' | 'linked_in' | "friends" | "chat_bot" | "community" | "none";
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

  @ManyToMany(() => GameSystem)
  @JoinTable()
  playerPlayedGameSystems!: GameSystem[];

  @Column('simple-array')
  customPlayerPlayedGameSystems!: string[];

  @Column('simple-array')
  customPlayerPreferredGameSystems!: string[];

  @Column('simple-array')
  playerPreferredDuration!: (UserDurationPreference | never)[];

  @Column('int')
  masterGamesPlayed!: number;

  @ManyToMany(() => GameSystem)
  @JoinTable()
  masterPreferredGameSystems!: GameSystem[];

  @ManyToMany(() => GameSystem)
  @JoinTable()
  masterPlayedGameSystems!: GameSystem[];

  @Column('simple-array')
  customMasterPlayedGameSystems!: string[];

  @Column('simple-array')
  customMasterPreferredGameSystems!: string[];

  @Column('simple-array', { nullable: true })
  masterPreferredDuration!: UserDurationPreference[];

  @Column('int', { nullable: true })
  playerAspectFight!: number | null;

  @Column('int', { nullable: true })
  playerAspectSocial!: number | null;

  @Column('int', { nullable: true })
  playerAspectExplore!: number | null;

  @Column('text', { nullable: true })
  playerMasterMessage!: string | null;

  @Column('text', { nullable: true })
  playerTriggers!: string | null;

}