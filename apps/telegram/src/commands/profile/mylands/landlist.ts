import { userInfo } from "os";
import { Land } from "../../../../../core/src/entities/land.entity";
import { getLands, getUserMemberships, leaveLand } from "../../../api";
import { CHAIN } from "../../../core/actions";
import { keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";
import { canAnnounceLocal, isGlobalAdmin, isLocalAdmin, isMasterInspector, isSupervisor } from "../roles";
import { parseRoles } from "../roles";

export const $myLandsList = optionsField<StateType>(
  async state => {
    return `<b><u>📍Панель Осередків: Мої осередки</u></b>\n\nОбери осередок, панель якого хочеш відкрити!`;
  },
  async state => {
    const user = state.data.storage.user;
    if(!user) return [];
    const memberships = await getUserMemberships(user);
    state.data.options["profile:landsById"] = {};
    if(user.globalRoles.find(r => r.tag === "supervisor")) {
      const list = await getLands();
      const lands = list.map(land => {
        const member = land.members.find(m => m.userId === user.id);
        const mark = !member ? "⚙️ " : member.status === "participant" ? "✨ " : "";
        return [[mark + land.name, land.id]];
      });
      list.forEach(land => state.data.options["profile:landsById"][land.id] = land)
      return [...lands, [["⬅️Назад", CONTROL.back]]] as keyboard;
    }
    const lands = memberships.all.map(m => {
      const mark = m.member.status === "participant" ? "✨ " : "";
      return [[mark + m.land.name, m.land.id]];
    });
    memberships.all.forEach(m => state.data.options["profile:landsById"][m.land.id] = m.land);
    return [...lands, [["⬅️Назад", CONTROL.back]]] as keyboard;
  },
  saveValue("profile:landId", CONTROL.back)
);

export const $landPanel = optionsField<StateType>(
  async state => {
    const user = state.data.storage.user;
    if(!user) return "ПОМИЛКА!";
    const landId = state.data.options["profile:landId"];
    const land = state.data.options["profile:chosenLand"] = state.data.options["profile:landsById"][landId] as Land;
    const roles = `\n\n<b>Твої ролі</b>:\n<i>${(await parseRoles(state, ["name", "publicName"], "local", "any", false, landId)).join("\n")}</i>`;
    const isMember = !!user.memberships.find(m => m.landId === landId && m.status === "participant");
    const isGuest = !!user.memberships.find(m => m.landId === landId && m.status === "guest");
    const text = isMember ? `Ти зареєстрований(на/ні) як УЧАСНИК в цьому Осередку.` : isGuest ? "Ти ГІСТЬ у цьому Осередку." : "Ти НЕ НАЛЕЖИШ до цього Осередку!";
    // display roles here
    return `<b><u>📍Панель Осередку "${land.name}"</u></b>\n\n${text}${roles}`;
  },
  async state => {
    const user = state.data.storage.user;
    if(!user) return [];
    const land = state.data.options["profile:chosenLand"] as Land;
    const member = user.memberships.find(m => m.landId === land.id);
    const isGuest = !!user.memberships.find(m => m.landId === land.id && m.status === "guest");
    let keyboard: keyboard = [[["⬅️Назад", CONTROL.back]]];
    if(isGuest) {
      keyboard = [[["👋Покинути осередок", MENU.option[0]]], ...keyboard];
    }
    else {
      keyboard = [[["🔁Змінити осередок*", MENU.option[1]]], ...keyboard];
    }
    if(await canAnnounceLocal("profile:chosenLand")(state)) {
      keyboard = [
        [["Нове Оголошення", MENU.option[50]]],
        ...keyboard
      ];
    }
    if(await isGlobalAdmin(state)) {
      keyboard = [
        [["Архівувати осередок*", MENU.option[30]]],
        ...keyboard
      ];
    }
    if(await isSupervisor(state)) {
      keyboard = [
        [["Змінити назву*", MENU.option[20]]],
        [["Змінити регіони*", MENU.option[21]]],
        ...keyboard
      ];
    }
    if(await isSupervisor(state) || (member && await isLocalAdmin("profile:chosenLand")(state))) {
      keyboard = [
        [["Список учасників", MENU.option[10]]],
        [["Ролі учасників", MENU.option[11]]],
        [["Вигнати учасника*", MENU.option[12]]],
        ...keyboard
      ];
    }
    if(await isMasterInspector("profile:chosenLand")(state)) {
      keyboard = [
        [["Запити", MENU.option[40]]],
        ...keyboard
      ];
    }
    return keyboard;
  }
);

export const $leaveLand = optionsField<StateType>(
  async state => {
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<b><u>📍Панель Осередків "${land.name}"</u></b>\n\n❗Ти дійсно хочеш покинути осередок "${land.name}"?\n\n❗Тебе буде видалено з чатів осередку, ти не зможеш отримувати їхні оголошення та твої місцеві ролі будуть незворотньо стерті!`;
  },
  [
    [["👋Так, покинути", CONTROL.next]],
    [["⬅️Повернутися", CONTROL.back]],
  ],
  async state => {
    if(!state.data.storage.user) return CHAIN.EXIT;
    const res = await leaveLand(state.data.storage.user.id, state.data.options["profile:chosenLand"].id);
    if(!res) return CHAIN.EXIT;
  }
);

export const $landLeft = optionsField<StateType>(
  async state => {
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<b><u>📍Панель Осередків "${land.name}"</u></b>\n\n❗Ти покинув(ла/ли) осередок "${land.name}".\n\nℹ️ Повернути доступ до чатів та оголошень ти можеш приєднавшись знову як гість!`;
  },
  [
    [["⬅️На головну", CONTROL.back]],
  ]
);