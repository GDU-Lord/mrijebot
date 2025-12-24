import { Request } from "../../../../../../core/src/entities/request.entity";
import { getLand, getUser } from "../../../../api";
import { getRequests } from "../../../../api/request";
import { keyboard } from "../../../../custom/hooks/buttons";
import { saveValue } from "../../../../custom/hooks/options";
import { StateType } from "../../../../custom/hooks/state";
import { CONTROL, MENU } from "../../../mapping";
import { optionsField } from "../../../presets/options";
import { getRoleByTag, isLocalAdmin, isMasterInspector } from "../../roles";
import { queryRequests } from "./middleware";
import { mentionUser } from "./utils";

export const $localRequests = optionsField<StateType>(
  async state => {
    const page = state.data.options["admin:requestsPage"] = state.data.options["admin:requestsPage"] ?? 0;
    return `<u><b>Адмінська Панель: Локальні Запити</b></u>\n\n<i>(Сторінка: ${page+1})</i>`;
  },
  async state => {
    let requests: Request[] = state.data.options["admin:requestsList"] = [];
    if(await isMasterInspector("profile:chosenLand")(state)) {
      requests.push(
        ...[
          ...await queryRequests("become_master", {
            role: await getRoleByTag(state, "master_inspector")
          }, {}, "open"),
        ].filter(r => {
          return r.fromMember?.landId === state.data.options["profile:chosenLand"]?.id
        }),
      );
    }
    if(await isLocalAdmin("profile:chosenLand")(state)) {
      requests.push(
        ...[
          ...await queryRequests("move_out", {
            role: await getRoleByTag(state, "local_admin")
          }, {}, "open"),
        ].filter(r => {
          return r.fromMember?.landId === state.data.options["profile:chosenLand"]?.id
        }),
        ...[
          ...await queryRequests("move_in", {
            role: await getRoleByTag(state, "local_admin")
          }, {}, "open"),
        ].filter(r => {
          return +r.content! === state.data.options["profile:chosenLand"]?.id;
        }),
      );
    }
    const pageSize = 5;
    const page = state.data.options["admin:requestsPage"];
    const index = page * pageSize;
    const buttons: keyboard = requests.slice(index, index+pageSize).map(r => {
      switch(r.tag) {
        case "become_master":
          return [["Майстер #" + r.id, r.id]];
        case "move_out":
          return [["Покинути Осередок #" + r.id, r.id]];
        case "move_in":
          return [["Приєднатися #" + r.id, r.id]];
        default:
          return [[r.tag, r.id]];
      }
    });
    return [
      ...buttons,
      [["⬅️", MENU.option[0]], ["➡️", MENU.option[1]]],
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
      text = text.replaceAll("[MENTION_USER]", mentionUser(user));
      const masterRole = state.data.storage.roles.find(r => r.tag === "master");
      text = text.replaceAll("[STATUS]", masterRole?.name ?? masterRole?.tag ?? "");
    }
    else if(request.tag === "move_out" && await isLocalAdmin("profile:chosenLand")(state)) {
      const user = await getUser(request.fromMember!.userId);
      const land = await getLand(+request.content!);
      text = `Користувач ${mentionUser(user)} хоче покинути цей осередок та стати Учасником Осередку "${land?.name}"! Дозволити йому покинути Осередок?`;
    }
    else if(request.tag === "move_in" && await isLocalAdmin("profile:chosenLand")(state)) {
      const user = request.fromUser;
      text = `Користувач ${mentionUser(user)} стати Учасником Осередку твого Осередку!`;
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