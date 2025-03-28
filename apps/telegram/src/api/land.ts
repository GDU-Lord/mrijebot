import { api } from ".";
import { CreateLandDto } from "../../../core/src/controllers/land/dtos/create-land.dto";
import { Land } from "../../../core/src/entities";

export async function createLand(
  name: string,
  region: string
) {
  return await api.post("/lands", { name, region } as CreateLandDto, {});
}

export async function getLands() {
  return await api.get<Land[]>("/lands") ?? [];
}