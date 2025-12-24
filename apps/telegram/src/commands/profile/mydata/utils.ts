import { api } from "../../../api";

export async function setUserData(id: number, field: "email" | "city" | "username", data: string) {
  return await api.put("/users/" + id + "/contacts", { [field]: data }, {}, (err) => console.log(err));
}