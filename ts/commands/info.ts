import { procedure } from "../core/chain.js";
import { menuProcedure } from "../custom/hooks/menu.js";
import { editLast } from "../custom/hooks/messageOptions.js";
import { backButtons } from "./back.js";

export const $info = procedure();
menuProcedure($info)
  .send(`<b><u>Інформація</u></b>\n\nМи українська ініціатива Настільних Рольових Ігор (НРІ) у Німеччині. Ми влаштовуємо ігри, тематичні святкування, майстер-класи, обговорення і робимо все можливе, щоб українці навіть тут мали змогу грати в НРІ рідною мовою!\n\n<b>Корисні посилання:</b>\n\n👉<a href="https://instagram.com/dream_forgers_ua">Наш інстаграм</a>\n👉<a href="https://nri.fandom.com/uk/wiki/%D0%9D%D0%B0%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D1%96_%D1%80%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D1%96_%D1%96%D0%B3%D1%80%D0%B8">Що таке НРІ?</a>\n👉<a href="https://sites.google.com/view/the-dreamforgers-ua/home">Наш вебсайт</a>`, backButtons.get, editLast());