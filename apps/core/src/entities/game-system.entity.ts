import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameSystem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  name!: string;
}
