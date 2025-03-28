import { api } from ".";
import { CreateLandDto } from "../../../core/src/controllers/land/dtos/create-land.dto";
import { Land, User } from "../../../core/src/entities";

export async function createLand(
  name: string,
  region: string
) {
  return await api.post("/lands", { name, region } as CreateLandDto, {});
}

export async function getLands() {
  return await api.get<Land[]>("/lands") ?? [];
}

export async function getLandsById() {
  const lands = await getLands();
  const res: {
    [key: string]: Land
  } = {};
  lands.forEach(l => res[l.id] = l);
  return res;
}

export async function getUserMemberships(user: User) {
  const lands = await getLandsById();
  let participant = user.memberships.filter(m => m.status === "participant").map(m => 
    {
      return {
        land: lands[m.landId],
        member: m
      }
    });
  let guest = user.memberships.filter(m => m.status === "guest").map(m => 
    {
      return {
        land: lands[m.landId],
        member: m
      }
    });
  return {
    participant,
    guest,
    all: [...participant, ...guest]
  }
}