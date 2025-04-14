import { getUserAnnouncements } from "../../../api/announcement";
import { getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { getDate } from "../../../custom/hooks/date";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL, MENU } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $myAnnouncements = optionsField<StateType>(
  async state => {
    const page = state.data.options["announcements:page"] = state.data.options["announcements:page"] ?? 0;
    return `<u><b>⚙️Профіль: Панель Оголошень</b></u>\n\nОбери оголошення, щоб керувати ним\n\n<i>(Сторінка: ${page+1})</i>`;
  },
  async state => {
    const announcements = state.data.options["announcements:list"] = await getUserAnnouncements(state.data.storage.user!.id) ?? [];
    const page = state.data.options["announcements:page"];
    const list = announcements.slice(page * 5, (page + 1) * 5).map(a => {
      const date = new Date(a.date);
      const text = getDate(date);
      return [[text, a.id]];
    }) as keyboard;
    return [
      ...list,
      [["⬅️", MENU.option[0]], ["➡️", MENU.option[1]]],
      [["⬅️Назад", CONTROL.back]]
    ];
  },
  saveValue("announcements:currentId", MENU.option[0], MENU.option[1], CONTROL.back)
);