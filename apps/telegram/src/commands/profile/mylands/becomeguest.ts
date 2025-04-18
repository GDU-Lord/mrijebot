import { Land } from "../../../../../core/src/entities";
import { getLands, getLandsById, getUser, joinLand } from "../../../api";
import { getLandChats } from "../../../api/chat";
import { CHAIN } from "../../../core/actions";
import { getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $becomeGuest = optionsField<StateType>(
  async state => {
    const lands = state.data.options["profile:becomeGuestLands"] = (await getLands())
      .filter(l => 
        l.members.filter(m => 
          m.userId === state.data.storage.user!.id && m.status !== "suspended"
        ).length === 0
      );
    if(!lands || !state.data.storage.user) return "ПОМИЛКА!";
    const list = lands.map(land => `📍<b>"${land.name}"</b>:\n${land.region.split(",").map(t => t.trim()).join(", ")}`);
    return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nОбери осередок, гостем якого ти хочеш стати:\n\n${list.join("\n\n")}`;
  },
  async state => {
    const lands = state.data.options["profile:becomeGuestLands"] as Land[] ?? [];
    const buttons = lands.map(l => [[l.name, l.id]]) as keyboard;
    return [
      ...buttons,
      [["⬅️Назад", CONTROL.back]],
    ];
  },
  async (state, buttons) => {
    const landId = getLastCallback(state, buttons);
    if(landId === CONTROL.back) return CHAIN.NEXT_ACTION; 
    if(!landId || !state.data.storage.user) return CHAIN.EXIT;
    state.data.options["profile:becomeGuestLand"] = (await getLandsById())[landId];
    const res = await joinLand(state.data.storage.user.id, landId, "guest");
    const user = state.data.storage.user = await getUser(state.data.storage.user.id);
    if(!user || !res) return CHAIN.EXIT;
  }
);

export const $becomeGuestDone = optionsField(
  async state => {
    const land = state.data.options["profile:becomeGuestLand"] as Land;
    if(!land) return "ПОМИЛКА!";
    const chatList = await getLandChats(land.id) ?? [];
    const chatsParsed = chatList.map(chat => {
      const marker = chat.users.find(u => u.id === state.data.storage.user?.id) ? "✅ " : "➡️ ";
      return `${marker}<a href="${chat.invite}">${chat.title}</a>`;
    });
    const chats = chatsParsed.length === 0 ? "\n\n<b>Чатів немає :(</b>" : `\n\n<b>Чати:</b>\n${chatsParsed.join("\n")}`;
    return `<b><u>👤Профіль: Стати гостем осередку</u></b>\n\nТепер ти гість осередку <b>${land.name}</b> (${land.region.split(",").map(t => t.trim()).join(", ")})!${chats}`;
  },
  async state => {
    return [
      [["⬅️Головне меню", CONTROL.back]],
    ];
  }
);