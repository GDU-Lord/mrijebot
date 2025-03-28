import { DataSource } from "typeorm";
import { CreateUserParams } from "./params";
import { GameSystem, Land, Member, User, UserDurationPreference } from "../../entities";

export class UserFeature {
  constructor(private dataSource: DataSource) { }

  public async getByTelegramId(telegramId: number): Promise<User> {
    // Get a User by id
    return new User;
  }

  public async create(telegramId: number, param: CreateUserParams): Promise<User> {
    // Create a new User
    return new User;
  }

  public async setPlayerPreferences(user: User, gameSystems: GameSystem[], duration: UserDurationPreference[]): Promise<User> {
    return new User;
  }

  public async joinLand(user: User, land: Land): Promise<Member> {
    // Join a Land
    return new Member;
  }

  public async leaveLand(user: User, land: Land): Promise<void> {
    // Leave a Land
  }
}