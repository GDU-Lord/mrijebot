import { api } from ".";
import { CreateGameSystemDto } from "../../../core/src/controllers/game-system/dtos/create-game-system.dto";
import { GameSystem } from "../../../core/src/entities";

export async function getSystems() {
  return await api.get<GameSystem[]>("/systems");
}

export async function createSystem(
  name: string
) {
  return await api.post("/systems", { name } as CreateGameSystemDto);
}