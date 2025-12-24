import { queueFunction } from "apps/telegram/src/core/cooldown";
import { Land } from "../../../../../../core/src/entities";
import { getMemberNames, getUserNames } from "../../../../api";
import { Bot } from "../../../../core";
import { CHAIN } from "../../../../core/actions";
import { procedure } from "../../../../core/chain";
import { createButtons } from "../../../../custom/hooks/buttons";
import { addCrum } from "../../../../custom/hooks/menu";
import { editLast } from "../../../../custom/hooks/messageOptions";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";
import { isLocalAdmin, isSupervisor, verifyEitherRole, verifyGlobalAdmin } from "../../roles";
import fs from "fs";

export const memberListButtons = createButtons([
  [["⬅️Назад", CONTROL.back]]
]);

export const $memberList = procedure();
$memberList.make()
  .func(verifyEitherRole(isSupervisor, isLocalAdmin("profile:chosenLand")))
  .func(addCrum($memberList))
  .send<StateType>(async state => {
    const path = `cache/memberList-${state.data.storage.user?.id ?? ""}.csv`;
    const land = state.data.options["profile:chosenLand"] as Land;
    const members = (await getMemberNames(land) ?? []).filter(m => m.status !== "suspended");
    const users = await getUserNames() ?? [];
    const usernameTable: {
      [key: string]: string | null;
    } = {};
    users.forEach(u => usernameTable[u.id] = u.username);
    if(!members || !users) return ["Помилка!", CHAIN.NEXT_LISTENER];
    const data = "sep =,\nUserID,MemberID,Username,Status,City\n" + members.map(m => `${m.userId},${m.id},${usernameTable[m.userId]},${m.status},${m.user.city}`).join("\n");
    try {
      await new Promise((res) => {
        fs.writeFile(path, data, "utf8", res);
      });
      const msg = await queueFunction(async () => await Bot.sendDocument(state.core.chatId, fs.createReadStream(path)));
      state.data.options["admin:fileSent"] = msg.message_id;
    } catch (err) { console.log(err) }
    return "<u><b>Адмінська Панель</b></u>\n\nЗавантаж таблицю з ID користувачів та їхніми нікнеймами!";
  }, memberListButtons.get, editLast());
