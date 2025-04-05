import { api } from "./api";

export async function getUserByTelegramId(telegramId: number) {

  return await api.get("/users/byTelegramId/" + telegramId, {}, (err) => console.log(err));

}