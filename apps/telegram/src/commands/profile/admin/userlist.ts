import { getUserNames } from "../../../api";
import { Bot } from "../../../core";
import { CHAIN } from "../../../core/actions";
import { procedure } from "../../../core/chain";
import { createButtons } from "../../../custom/hooks/buttons";
import { editLast } from "../../../custom/hooks/messageOptions";
import { StateType } from "../../../custom/hooks/state";
import { backButtons } from "../../back";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { isGlobalAdmin, verifyGlobalAdmin } from "./hooks";
import fs from "fs";

export const userListButtons = createButtons([
  [["⬅️Назад", CONTROL.back]]
]);

export const $userList = procedure();
$userList.make()
  .func(verifyGlobalAdmin())
  .send<StateType>(async state => {
    const path = `cache/userlist-${state.data.storage.user?.id ?? ""}.csv`;
    const list = await getUserNames();
    if(!list) return ["Помилка!", CHAIN.NEXT_LISTENER];
    const data = "sep =,\nID,username\n" + list.map(u => `${u.id},${u.name}`).join("\n");
    try {
      await new Promise((res) => {
        fs.writeFile(path, data, "utf-8", res);
      });
      const msg = await Bot.sendDocument(state.core.chatId, fs.createReadStream(path));
      state.data.options["admin:fileSent"] = msg.message_id;
    } catch (err) { console.log(err) }
    return "<u><b>Адмінська Панель</b></u>\n\nЗавантаж таблицю з ID користувачів та їхніми нікнеймами!";
  }, userListButtons.get, editLast());
