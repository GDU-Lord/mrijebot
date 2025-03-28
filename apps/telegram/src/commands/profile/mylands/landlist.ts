import { Land } from "../../../../../core/src/entities/land.entity";
import { getUserMemberships, leaveLand } from "../../../api";
import { CHAIN } from "../../../core/actions";
import { keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $myLandsList = optionsField<StateType>(
  async state => {
    return `<b><u>📍Панель Осередків: Мої осередки</u></b>\n\nОбери осередок, панель якого хочеш відкрити!`;
  },
  async state => {
    if(!state.data.storage.user) return [];
    const memberships = await getUserMemberships(state.data.storage.user);
    state.data.options["profile:landsById"] = {};
    const lands = memberships.all.map(m => {
      // const mark = l.members.
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
    if(!state.data.storage.user) return "ПОМИЛКА!";
    const landId = state.data.options["profile:landId"];
    const land = state.data.options["profile:chosenLand"] = state.data.options["profile:landsById"][landId] as Land;
    const roles = `\n<b>Твої ролі</b>: <i>в розробці</i>`;
    const isMember = !!state.data.storage.user.memberships.find(m => m.landId === landId && m.status === "participant");
    const text = isMember ? `Ти зареєстрований(на/ні) як УЧАСНИК в цьому Осередку.` : "Ти ГІСТЬ у цьому осередку.";
    // display roles here
    return `<b><u>📍Панель Осередків: ${land.name}</u></b>\n\n${text}\n${roles}`;
  },
  async state => {
    // add admin options
    if(!state.data.storage.user) return [];
    const land = state.data.options["profile:chosenLand"] as Land;
    const isMember = !!state.data.storage.user.memberships.find(m => m.landId === land.id && m.status === "participant");
    let keyboard: keyboard = [[["⬅️Назад", CONTROL.back]]];
    if(!isMember) {
      keyboard = [[["👋Покинути осередок", MENU.option[0]]], ...keyboard];
    }
    else {
      keyboard = [[["🔁Змінити осередок*", MENU.option[1]]], ...keyboard];
    }
    return keyboard;
  }
);

export const $leaveLand = optionsField<StateType>(
  async state => {
    const land = state.data.options["profile:chosenLand"] as Land;
    return `<b><u>📍Панель Осередків: ${land.name}</u></b>\n\n❗Ти дійсно хочеш покинути осередок "${land.name}"?\n\n❗Тебе буде видалено з чатів осередку, ти не зможеш отримувати їхні оголошення та твої місцеві ролі будуть незворотньо стерті!`;
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
    return `<b><u>📍Панель Осередків: ${land.name}</u></b>\n\n❗Ти покинув(ла/ли) осередок "${land.name}".\n\nℹ️ Повернути доступ до чатів та оголошень ти можеш приєднавшись знову як гість!`;
  },
  [
    [["⬅️На головну", CONTROL.back]],
  ]
);