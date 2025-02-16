import { DataSource } from "typeorm";
import { CreateUserParam } from "./params";
import { Land, Member, User } from "../../entities";

export class UserFeature {
  constructor(private dataSource: DataSource) { }

  public async getByTelegramId(telegramId: number): Promise<User> {
    // Get a User by id
  }

  public async create(telegramId: number, param: CreateUserParam): Promise<User> {
    // Create a new User
  }

  public async setPlayerPreferences(user: User, gameSystems: GameSystem[], duration: UserDurationPreference[]): Promise<User> {
    
  }

  public async joinLand(user: User, land: Land): Promise<Member> {
    // Join a Land
  }

  public async leaveLand(user: User, land: Land): Promise<void> {
    // Leave a Land
  }
}