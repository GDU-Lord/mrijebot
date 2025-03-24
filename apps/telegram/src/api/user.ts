import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { GameSystem, Member, User, UserDiscoverySource, UserDurationPreference } from "../../../core/src/entities";
import { CreateUserDto } from "../../../core/src/controllers/user/dtos/create-user.dto";

export async function getUserByTelegram(telegramId: number) {
  try {
    const res = await axios.get<User>(`http://localhost:3000/users/byTelegramId/${telegramId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function createUser(
  telegramId: number,
  email: string,
  discoverySource: UserDiscoverySource,
  city: string,
  playerGamesPlayed: number,
  masterGamesPlayed: number,
) {
  const data: CreateUserDto = {
    email,
    city,
    discoverySource,
    playerGamesPlayed,
    masterGamesPlayed,
  };
  const res = await axios.post(`http://localhost:3000/users`, data, { params: { telegramId } });
  console.log(res.data);
}