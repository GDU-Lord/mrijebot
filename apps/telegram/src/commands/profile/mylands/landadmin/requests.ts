import { Request } from "../../../../../../core/src/entities/request.entity";
import { getUser } from "../../../../api";
import { getRequests } from "../../../../api/request";
import { keyboard } from "../../../../custom/hooks/buttons";
import { saveValue } from "../../../../custom/hooks/options";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL } from "../../../mapping";
import { optionsField } from "../../../presets/options";
import { optionsOtherField } from "../../../presets/optionsOther";
import { number } from "../../../presets/validators";
import { getRoleByTag, isMasterInspector } from "../../roles";
import { queryRequests } from "./middleware";

export const $localRequests = optionsField<StateType>(
  async state => {
    return "<u><b>Адмінська Панель: Локальні Запити</b></u>\n\nОбери запит, який хочеш обробити!";
  },
  async state => {const requests: Request[] = [];
    if(await isMasterInspector("profile:chosenLand")(state)) {
      requests.push(
        ...await queryRequests("become_master", {
          role: await getRoleByTag(state, "master_inspector")
        }, {}, "open")
      );
    }
    const pageSize = 5;
    const page = 0;
    const index = page * pageSize;
    const buttons: keyboard = requests.slice(index, index+pageSize).map(r => {
      switch(r.tag) {
        case "become_master":
          return [["Майстер #" + r.id, r.id]];
        default:
          return [[r.tag, r.id]];
      }
    });
    return [
      ...buttons,
      [["⬅️Назад", CONTROL.back]],
    ];
  },
  saveValue("admin:requestChosenId", CONTROL.back)
);

export const $localRequest = optionsField<StateType>(
  async state => {
    const id = state.data.options["admin:requestChosenId"] as number;
    const [request] = await getRequests({ id }) ?? [];
    if(!request) return "<u><b>Адмінська Панель: Локальні Запити</b></u>\n\nПомилка завантаження запиту!";
    state.data.options["admin:requestChosen"] = request;
    let text = request.content ?? "";
    if(request.tag === "become_master" && await isMasterInspector("profile:chosenLand")(state)) {
      const user = await getUser(request.fromMember!.userId);
      text = text.replaceAll("[MENTION_USER]", `<a href="tg://user?id=${user?.telegramId}">${user?.username}</a>`);
      const masterRole = state.data.storage.roles.find(r => r.tag === "master");
      text = text.replaceAll("[MASTER_STATUS]", masterRole?.name ?? masterRole?.tag ?? "");
    }
    return `<u><b>Адмінська Панель: Локальні Запити</b></u>\n\n${text}`;
  },
  [
    [["❌Відхилити", CONTROL.clear]],
    [["✅Підписати", CONTROL.next]],
    [["⬅️Назад", CONTROL.back]],
  ],
  saveValue("admin:requestAction", CONTROL.back)
);