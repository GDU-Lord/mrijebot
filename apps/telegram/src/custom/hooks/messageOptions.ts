import { LocalState } from "../../core/state";

export function editLast() {
  return async (state: LocalState) => {
    return state.lastMessageSent?.message_id;
  };
}