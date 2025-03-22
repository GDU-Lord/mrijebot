import { LocalState } from "../../core/state.js";

export function editLast() {
  return async (state: LocalState) => {
    return state.lastMessageSent?.message_id;
  };
}