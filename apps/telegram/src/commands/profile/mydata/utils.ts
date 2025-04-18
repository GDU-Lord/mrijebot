import { api } from "../../../api";

export async function setUserData(id: number, field: "email" | "city" | "username", data: string) {
  console.log({ [field]: data });
  return await api.put("/users/" + id + "/contacts", { [field]: data }, {}, (err) => console.log(err));
}