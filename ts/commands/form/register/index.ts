import { afterInit } from "../../../afterInit.js";
import { getLastCallback, saveValue, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks.js";
import { optionsField } from "../../presets/options.js";
import { optionsOtherField } from "../../presets/optionsOther.js";
import { textField } from "../../presets/textfield.js";
import { email, text } from "../validators.js";
import { registerRoutes } from "./routes.js";

afterInit.push(registerRoutes);

export const [$email, email$] = textField(
  "form:email", 
  async state => {
    return "<b><u>Реєстрація: Контакт</u></b>\n\nНам потрібна твоя Email-адреса, щоб зв'язатися з тобою пізніше!\n\nВведи її у повідомленні:";
  },
  email()
);

export const [$land, land$, landButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Осередок</u></b>\n\nУ нас є різні Осередки (регіональні спільноти) по всій Німеччині. Обери ту, на території якої ти проживаєш! Після реєстрації ти отримаєш доступ до чатів свого Осередку!";
  },
  [
    [["Berlin", 1]],
    [["Bayern", 2]],
    [["Mittledeutschland", 3]],
    [["Niedersachsen", 4]],
    [["⬅️Назад", 0]]
  ],
  saveValue("form:land", 0)
);

export const [$city, city$] = textField(
  "form:city", 
  async state => {
    return "<b><u>Реєстрація: Осередок</u></b>\n\nВведи назву населеного пункту, в якому ти проживаєш:";
  },
  text()
);

export const [$source, source$, sourceButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація</u></b>\n\nЯк ти дізнав(ла/ли)ся про Мрієтворців?";
  },
  [
    [["Instagram", 2]],
    [["Linked-In", 3]],
    [["Вебсайт", 4]],
    [["Через знайомих", 5]],
    [["Чат-бот для знайомств", 6]],
    [["Я вже у спільноті", 7]],
    [["⬅️Назад", 0], ["➡️Пропустити", 1]],
  ],
  saveValue("form:source", 0, 1)
);

export const [$played, played$, playedButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЧи маєш ти досвід у Настільних Рольових Іграх (НРІ)?\n\n❗Якщо ти не знаєш що це - обов'язково ознайомся з <a href=\"https://nri.fandom.com/uk/wiki/%D0%9D%D0%B0%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D1%96_%D1%80%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D1%96_%D1%96%D0%B3%D1%80%D0%B8\">ЦІЄЮ СТАТТЕЮ</a> перед тим, як продовжити!";
  },
  [
    [["Маю досвід гри", 1]],
    [["Не маю досвіду, але цікаво", 2]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:played", 0)
);

export const [$gamesPlayed, gamesPlayed$, gamesPlayedButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nСкільки в тебе досвіду в НРІ як гравця?"
  },
  [
    [["До 5 сесій", 1]],
    [["Від 5 до 10 сесій", 2]],
    [["Від 10 до 50 сесій", 3]],
    [["Понад 50 сесій", 4]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:gamesPlayed", 0),
);

export const [$systemsPlayed, systemsPlayed$, systemsPlayedButtons] = optionsOtherField(
  "lastInput",
  async state => {
    const list = [];
    for(const i in state.data.options) {
      const [part, field, ...rest] = i.split(":");
      const value = rest.join(":");
      const status = state.data.options[i];
      if(part === "form" && field === "systemsPlayed" && text()(value) && status)
        list.push(value);
    }
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nУ які Настільні Рольові Системи ти грав(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: " + list.join(";");
  },
  toggleButtons(
    "form:systemsPlayed", 
    [
      [["ДнД", 2]],
      [["Кіберпанк", 3]],
      [["Савага", 4]],
      [["Архетерика", 5]],
      [["⬅️Назад", 0], ["➡️Далі", 1]],
    ],
    "✅ ",
    "",
    0, 1),
  text(),
  toggleValue("form:systemsPlayed", 0, 1),
  toggleValueInput("form:systemsPlayed")
);

export const [$playGameTypes, playGameTypes$, playGameTypes] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nУ які види НРІ ти хочеш грати?\n\n<b>Сесія</b> - зазвичай триває 3-6 годин\n<b>Ваншот</b> - цілісна гра на одну сесію\n<b>Міні-кампанія</b> - гра до 5 сесій\n<b>Кампанія</b> - гра, що триває більше 5 сесій. Може гратися роками :)";
  },
  toggleButtons(
    "form:playGameTypes", 
    [
      [["Ваншоти", 2]],
      [["Міні-кампанії", 3]],
      [["Довгі кампанії", 4]],
      [["⬅️Назад", 0], ["➡️Далі", 1]],
    ], 
    "✅ ",
    "", 
    0, 1),
  toggleValue("form:playGameTypes", 0, 1)
);

export const [$mastered, mastered$, masteredButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЧи є в тебе досвід проведення власних ігор (як майстер)?\n\nМайстер - це ведучий гри, що відповідає за правила, світ та неігрових персонажів у ньому.";
  },
  [
    [["Проводив ігри", 1]],
    [["Хочу спробувати провести", 2]],
    [["Не проводив(ла/ли) ігри й не хочу", 3]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:mastered", 0)
);

export const [$gamesMastered, gamesMastered$, gamesMasteredButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nСкільки сесій ти провів/провела/провели як майстер?";
  },
  [
    [["До 5 сесій", 1]],
    [["Від 6 до 10 сесій", 2]],
    [["Від 11 до 50 сесій", 3]],
    [["Понад 50 сесій", 4]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:gamesMastered", 0)
);

export const [$systemsMastered, systemsMastered$, systemsMasteredButtons] = optionsOtherField(
  "lastInput",
  async state => {
    const list = [];
    for(const i in state.data.options) {
      const [part, field, ...rest] = i.split(":");
      const value = rest.join(":");
      const status = state.data.options[i];
      if(part === "form" && field === "systemsMastered" && text()(value) && status)
        list.push(value);
    }
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЯкі Настільні Рольові Системи ти водив(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: " + list.join(";");
  },
  toggleButtons(
    "form:systemsMastered", 
    [
      [["ДнД", 2]],
      [["Кіберпанк", 3]],
      [["Савага", 4]],
      [["Архетерика", 5]],
      [["⬅️Назад", 0], ["➡️Далі", 1]],
    ], 
    "✅ ",
    "", 
    0, 1),
  text(),
  toggleValue("form:systemsMastered", 0, 1),
  toggleValueInput("form:systemsMastered")
);

export const [$masterGameTypes, masterGameTypes$, masterGameTypesButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЯкі види НРІ ти хочеш водити як майстер?\n\n<b>Сесія</b> - зазвичай триває 3-6 годин\n<b>Ваншот</b> - цілісна гра на одну сесію\n<b>Міні-кампанія</b> - гра до 5 сесій\n<b>Кампанія</b> - гра, що триває більше 5 сесій. Може гратися роками :)"
  },
  toggleButtons(
    "form:masterGameTypes", 
    [
      [["Ваншоти", 2]],
      [["Міні-кампанії", 3]],
      [["Довгі кампанії", 4]],
      [["⬅️Назад", 0], ["➡️Далі", 1]],
    ], 
    "✅ ",
    "", 
    0, 1),
  toggleValue("form:masterGameTypes", 0, 1)
);

export const [$formDone, formDone$, formDoneButtons] = optionsField(
  async state => {
    return "<b><u>Реєстрація: Захист Даних</u></b>\n\nВсі поля заповнено!\n\nЩоб завершити реєстрацію перевір чи всі дані вказано вірно та дай дозвіл на обробку цих даних Центральною Радою Мрієтворців та Координаційним Органом Осередку [ТУТ НАЗВА ОСЕРЕДКУ]";
  },
  [
    [["⬅️Назад", 0], ["✅ Даю дозвіл!", 1]],
  ],
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === 0) return;
    console.log(state.data.options);
    console.log(Object.values(state.core.inputs).map(msg => msg?.text));
  }
);

export const [$formSent, formSent$, formSentButtons] = optionsField(
  async state => {
    return "<b><u>✅ Реєстрацію завершено</u></b>\n\nТут всі посилання:..."
  },
  [
    [["Головне меню", 0]],
  ]
);
