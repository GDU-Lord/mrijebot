import { Announcement } from "../../../../../core/src/entities/announcement.entity";
import { LocalState } from "../../../core/state";
import { StateType } from "../../../custom/hooks/state";

export async function prevPage(state: LocalState<StateType>) {
  const list = state.data.options["announcements:list"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["announcements:page"] ?? 1) - 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["announcements:page"] = current;
}

export async function nextPage(state: LocalState<StateType>) {
  const list = state.data.options["announcements:list"] as Announcement[];
  const pages = Math.ceil(list.length / 5);
  let current = (state.data.options["announcements:page"] ?? -1) + 1;
  if(current >= pages)
    current = 0;
  if(current < 0)
    current = pages-1;
  state.data.options["announcements:page"] = current;
}

export async function getAnnouncement(state: LocalState<StateType>) {
  const id = state.data.options["announcements:currentId"] as number;
  state.data.options["announcements:current"] = state.data.options["announcements:list"].find((a: any) => a.id === id);
}