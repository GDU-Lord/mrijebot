import { getAllRoles } from "../../../api/role";
import { Bot } from "../../../core";
import { LocalState } from "../../../core/state";
import { StateType } from "../../../custom/hooks/state";

export async function removeSentFile(state: LocalState<StateType>) {
  const msgId = state.data.options["admin:fileSent"];
  try {
    await Bot.deleteMessage(state.core.chatId, msgId);
  } catch {}
}

export async function updateRoles(state: LocalState<StateType>) {
  state.data.options["admin:allRoles"] = await getAllRoles();
}