import { Land } from "../../../app/entities/land.entity";
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
    let member = state.data.storage.user!.memberships.filter(m => m.status === "participant").map(m => [[m.land.name, m.landId]]);
    let guest = state.data.storage.user!.memberships.filter(m => m.status === "guest").map(m => [[m.land.name, m.landId]]);
    const landsById = state.data.storage.user!.memberships.map(m => m.land);
    state.data.options["profile:landsById"] = {};
    landsById.forEach(land => state.data.options["profile:landsById"][land.id] = land);
    return [...member, ...guest, [["⬅️Назад", CONTROL.back]]] as keyboard;
  },
  saveValue("profile:landId", CONTROL.back)
);

export const $landPanel = optionsField<StateType>(
  async state => {
    const landId = state.data.options["profile:landId"];
    const land = state.data.options["profile:landsById"][landId] as Land;
    const roles = `\n<b>Твої ролі</b>: Координатор Осередку, Представник, Інспектор Майстрів`;
    const isMember = !!land.members.find(m => m.userId === state.data.storage.user?.id && m.status === "participant");
    state.data.options["profile:chosenLand"] = land;
    const text = isMember ? `Ти зареєстрований як УЧАСНИК в цьому Осередку.` : "Ти гість у цьому осередку.";
    // display roles here
    return `<b><u>📍Панель Осередків: ${land.name}</u></b>\n\n${text}\n${roles}`;
  },
  async state => {
    // add admin options
    // add option to leave 
    const land = state.data.options["profile:chosenLand"] as Land;
    const isMember = !!land.members.find(m => m.userId === state.data.storage.user?.id && m.status === "participant");
    let keyboard: keyboard = [[["⬅️Назад", CONTROL.back]]];
    if(!isMember) {
      keyboard = [[["👋Покинути осередок", MENU.option[0]]], ...keyboard];
    }
    else {
      keyboard = [[["🔁Змінити членство", MENU.option[1]]], ...keyboard];
    }
    return keyboard;
  }
);