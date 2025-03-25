import { afterInit } from "../../../afterInit";
import { createUser, getSystems, getUser, joinLand, setMasterPreferences, setPlayerPreferences } from "../../../api";
import { getLands } from "../../../api/land";
import { UserDurationPreference } from "../../../app/entities";
import { getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { saveValue, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";
import { textField } from "../../presets/textfield";
import { email, text } from "../validators";
import { GAME_TYPES, MASTERED, PLAYED, SOURCE } from "./mapping";
import { registerRoutes } from "./routes";

afterInit.push(registerRoutes);

export const $email = textField(
  "form:email", 
  async state => {
    return "<b><u>Реєстрація: Контакт</u></b>\n\nНам потрібна твоя Email-адреса, щоб зв'язатися з тобою пізніше!\n\nВведи її у повідомленні:";
  },
  email()
);

export const $land = optionsField<StateType>(
  async state => {
    const lands = state.data.storage.lands = await getLands();
    if(!lands) return "ПОМИЛКА!";
    const list = lands.map(land => `<b>"${land.name}"</b>: ${land.region}`);
    return `<b><u>Реєстрація: Осередок</u></b>\n\nУ нас є різні Осередки (регіональні спільноти) по всій Німеччині. Обери ту, на території якої ти проживаєш! Після реєстрації ти отримаєш доступ до чатів свого Осередку!\n\n${list.join("\n")}`;
  },
  async state => {
    const buttons = state.data.storage.lands.map(land => [[land.name, land.id]]) as keyboard;
    return [
      ...buttons,
      [["⬅️Назад", 0]],
    ]
  },
  saveValue("form:land", 0)
);

export const $city = textField(
  "form:city", 
  async state => {
    return "<b><u>Реєстрація: Осередок</u></b>\n\nВведи назву населеного пункту, в якому ти проживаєш:";
  },
  text()
);

export const $source = optionsField(
  async state => {
    return "<b><u>Реєстрація</u></b>\n\nЯк ти дізнав(ла/ли)ся про Мрієтворців?";
  },
  [
    [["Instagram", SOURCE.instagram]],
    [["Linked-In", SOURCE.linked_in]],
    [["Через знайомих", SOURCE.friends]],
    [["Чат-бот для знайомств", SOURCE.chat_bot]],
    [["Я вже у спільноті", SOURCE.community]],
    [["⬅️Назад", 0], ["➡️Пропустити", SOURCE.none]],
  ],
  saveValue("form:source", 0, -1)
);

export const $played = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЧи маєш ти досвід у Настільних Рольових Іграх (НРІ)?\n\n❗Якщо ти не знаєш що це - обов'язково ознайомся з <a href=\"https://nri.fandom.com/uk/wiki/%D0%9D%D0%B0%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D1%96_%D1%80%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D1%96_%D1%96%D0%B3%D1%80%D0%B8\">ЦІЄЮ СТАТТЕЮ</a> перед тим, як продовжити!";
  },
  [
    [["Маю досвід гри", PLAYED.has_experience]],
    [["Не маю досвіду, але цікаво", PLAYED.no_experience]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:played", 0)
);

export const $gamesPlayed = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nСкільки в тебе досвіду в НРІ як гравця?"
  },
  [
    [["До 5 сесій", 5]],
    [["Від 6 до 10 сесій", 10]],
    [["Від 11 до 50 сесій", 50]],
    [["Понад 50 сесій", 100]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:gamesPlayed", 0),
);

export const $systemsPlayed = optionsOtherField<StateType>(
  "lastInput",
  async state => {
    state.data.storage.systems = await getSystems() ?? [];
    const list: string[] = [];
    for(const i in state.data.options) {
      const [part, field, ...rest] = i.split(":");
      const value = rest.join(":");
      const status = state.data.options[i];
      if(part === "form" && field === "systemsPlayed" && text()(value) && status)
        list.push(value);
    }
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nУ які Настільні Рольові Системи ти грав(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: " + list.join(";");
  },
  toggleButtons<StateType>(
    "form:systemsPlayed", 
    async state => {
      const buttons = state.data.storage.systems.map(s => {
        return [[s.name, s.id]];
      }) as keyboard;
      return [
        ...buttons, 
        [["⬅️Назад", 0], ["➡️Далі", -1]]
      ];
    },
    "✅ ",
    "",
    0, -1),
  text(),
  toggleValue("form:systemsPlayed", 0, -1),
  toggleValueInput("form:systemsPlayed")
);

export const $playGameTypes = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nУ які види НРІ ти хочеш грати?\n\n<b>Сесія</b> - зазвичай триває 3-6 годин\n<b>Ваншот</b> - цілісна гра на одну сесію\n<b>Міні-кампанія</b> - гра до 5 сесій\n<b>Кампанія</b> - гра, що триває більше 5 сесій. Може гратися роками :)";
  },
  toggleButtons(
    "form:playGameTypes", 
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Довгі кампанії", GAME_TYPES.long_campaign]],
      [["⬅️Назад", 0], ["➡️Далі", -1]]
    ], 
    "✅ ",
    "", 
    0, -1),
  toggleValue("form:playGameTypes", 0, -1)
);

export const $mastered = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЧи є в тебе досвід проведення власних ігор (як майстер)?\n\nМайстер - це ведучий гри, що відповідає за правила, світ та неігрових персонажів у ньому.";
  },
  [
    [["Проводив ігри", MASTERED.is_master]],
    [["Хочу спробувати провести", MASTERED.wants_master]],
    [["Не проводив(ла/ли) ігри й не хочу", MASTERED.no_master]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:mastered", 0)
);

export const $gamesMastered = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nСкільки сесій ти провів/провела/провели як майстер?";
  },
  [
    [["До 5 сесій", 5]],
    [["Від 6 до 10 сесій", 10]],
    [["Від 11 до 50 сесій", 50]],
    [["Понад 50 сесій", 100]],
    [["⬅️Назад", 0]],
  ],
  saveValue("form:gamesMastered", 0)
);

export const $systemsMastered = optionsOtherField(
  "lastInput",
  async state => {
    state.data.storage.systems = await getSystems() ?? [];
    const list: string[] = [];
    for(const i in state.data.options) {
      const [part, field, ...rest] = i.split(":");
      const value = rest.join(":");
      const status = state.data.options[i];
      if(part === "form" && field === "systemsMastered" && text()(value) && status)
        list.push(value);
    }
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЯкі Настільні Рольові Системи ти водив(ла/ли)?\n\nТи можеш додати власні варіанти, ввівши їх у повідомленні. Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\nВведені вручну: " + list.join(";");
  },
  toggleButtons<StateType>(
    "form:systemsMastered", 
    async state => {
      const buttons = state.data.storage.systems.map(s => {
        return [[s.name, s.id]];
      }) as keyboard;
      return [
        ...buttons, 
        [["⬅️Назад", 0], ["➡️Далі", -1]]
      ];
    }, 
    "✅ ",
    "", 
    0, -1),
  text(),
  toggleValue("form:systemsMastered", 0, -1),
  toggleValueInput("form:systemsMastered")
);

export const $masterGameTypes = optionsField(
  async state => {
    return "<b><u>Реєстрація: Досвід в НРІ</u></b>\n\nЯкі види НРІ ти хочеш водити як майстер?\n\n<b>Сесія</b> - зазвичай триває 3-6 годин\n<b>Ваншот</b> - цілісна гра на одну сесію\n<b>Міні-кампанія</b> - гра до 5 сесій\n<b>Кампанія</b> - гра, що триває більше 5 сесій. Може гратися роками :)"
  },
  toggleButtons(
    "form:masterGameTypes", 
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Довгі кампанії", GAME_TYPES.long_campaign]],
      [["⬅️Назад", 0], ["➡️Далі", -1]],
    ], 
    "✅ ",
    "", 
    0, -1),
  toggleValue("form:masterGameTypes", 0, -1)
);

export const $formDone = optionsField<StateType>(
  async state => {
    return "<b><u>Реєстрація: Захист Даних</u></b>\n\nВсі поля заповнено!\n\nЩоб завершити реєстрацію перевір чи всі дані вказано вірно та дай дозвіл на обробку цих даних Центральною Радою Мрієтворців та Координаційним Органом Осередку [ТУТ НАЗВА ОСЕРЕДКУ]";
  },
  [
    [["⬅️Назад", 0], ["✅ Даю дозвіл!", 1]],
  ],
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data === 0) return;

    const systemsPlayed: number[] = [];
    const systemsMastered: number[] = [];

    const customSystemsPlayed: string[] = [];
    const customSystemsMastered: string[] = [];

    const playGameTypes: UserDurationPreference[] = [];
    const masterGameTypes: UserDurationPreference[] = [];

    console.log(state.data.options);
    // console.log(state.core.);

    for(const i in state.data.options) {
      const parts = i.split(":");
      if(parts[0] === "form") {
        switch (parts[1]) {
          case "systemsPlayed":
            if(!state.data.options[i]) break;
            if(isNaN(+parts[2])) customSystemsPlayed.push(parts[2]);
            else systemsPlayed.push(+parts[2]);
            break;
          case "systemsMastered":
            if(!state.data.options[i]) break;
            if(isNaN(+parts[2])) customSystemsMastered.push(parts[2]);
            else systemsMastered.push(+parts[2]);
            break;
          case "playGameTypes":
            if(!state.data.options[i]) break;
            playGameTypes.push(parts[2] as UserDurationPreference);
            break;
          case "masterGameTypes":
            if(!state.data.options[i]) break;
            masterGameTypes.push(parts[2] as UserDurationPreference);
            break;
        }
      }
    }

    console.log("data", customSystemsPlayed, customSystemsMastered);

    let user = await createUser(
      state.core.userId,
      state.core.inputs["form:email"]?.text!,
      state.data.options["form:source"],
      state.core.inputs["form:city"]?.text!,
      state.data.options["form:gamesPlayed"] ?? 0,
      state.data.options["form:gamesMastered"] ?? 0,
    );

    console.log("initial", user);

    if(!user) return;

    const playerPrefs = await setPlayerPreferences(
      user.id,
      systemsPlayed,
      systemsPlayed,
      customSystemsPlayed,
      customSystemsPlayed,
      playGameTypes,
    );

    if(!playerPrefs) return;

    console.log("player");

    const masterPrefs = await setMasterPreferences(
      user.id,
      systemsMastered,
      systemsMastered,
      customSystemsMastered,
      customSystemsMastered,
      masterGameTypes,
    );

    if(!masterPrefs) return;

    console.log("master");

    const membership = joinLand(
      user.id, 
      state.data.options["form:land"], 
      "participant"
    );

    if(!membership) return;

    console.log("membership");

    user = await getUser(user.id);

    if(!user) return;

    state.data.storage.user = user;

    console.log(state.data.storage.user);

  }
);

export const $formSent = optionsField(
  async state => {
    return "<b><u>✅ Реєстрацію завершено</u></b>\n\nПриєднуйся до чатів свого Осередку Мрієтворців!\n\n👉Чат 1\n👉Чат 2\n👉Чат 3";
  },
  [
    [["Головне меню", 0]],
  ]
);
