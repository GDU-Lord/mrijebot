import { UserDurationPreference } from "../../../../../core/src/entities/user.entity";
import { afterInit } from "../../../afterInit";
import { createUser, getSystems, getUser, joinLand, setMasterPreferences, setPlayerPreferences } from "../../../api";
import { getLands } from "../../../api/land";
import { getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { saveValue, toggleButtons, toggleValue, toggleValueInput } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";
import { optionsOtherField } from "../../presets/optionsOther";
import { textField } from "../../presets/textfield";
import { email, text } from "../../presets/validators";
import { GAME_TYPES, MASTERED, PLAYED, SOURCE } from "./mapping";
import { registerRoutes } from "./routes";

afterInit.push(registerRoutes);

export const $email = textField(
  "form:email", 
  async state => {
    return "<b><u>👤Реєстрація: Контакт</u></b>\n\n📧 Нам потрібна твоя Email-адреса, для управління нашим гуглдиском та зручнішої комунікації з тобою!\n\nℹ️ Введи її у повідомленні:";
  },
  email()
);

export const $land = optionsField<StateType>(
  async state => {
    const telegramUser = state.lastInput.from;
    state.data.options["form:username"] = telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.first_name ?? null;
    const lands = state.data.storage.lands = await getLands();
    if(!lands) return "ПОМИЛКА!";
    const list = lands.map(land => `📍<b>"${land.name}"</b>:\n${land.region.split(",").map(t => t.trim()).join(", ")}`);
    return `<b><u>👤Реєстрація: Осередок</u></b>\n\nУ нас є різні Осередки (регіональні спільноти) по всій Німеччині.\n\nℹ️ Обери ту, на території якої ти проживаєш!\nℹ️ Після реєстрації ти отримаєш доступ до чатів свого Осередку!\n\n${list.join("\n\n")}`;
  },
  async state => {
    const buttons = state.data.storage.lands.map(land => [[land.name, land.id]]) as keyboard;
    return [
      ...buttons,
      [["⬅️Назад", CONTROL.back]],
    ]
  },
  saveValue("form:land", CONTROL.back)
);

export const $city = textField(
  "form:city", 
  async state => {
    return "<b><u>👤Реєстрація: Осередок</u></b>\n\n📍Введи назву населеного пункту, в якому ти проживаєш:";
  },
  text()
);

export const $source = optionsField(
  async state => {
    return "<b><u>👤Реєстрація</u></b>\n\n❔Як ти дізнав(ла/ли)ся про Мрієтворців?";
  },
  [
    [["Instagram", SOURCE.instagram]],
    [["Linked-In", SOURCE.linked_in]],
    [["Через знайомих", SOURCE.friends]],
    [["Чат-бот для знайомств", SOURCE.chat_bot]],
    [["Я вже у спільноті", SOURCE.community]],
    [["⬅️Назад", CONTROL.back], ["➡️Пропустити", SOURCE.none]],
  ],
  saveValue("form:source", CONTROL.back, CONTROL.next)
);

export const $played = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 Чи маєш ти досвід у Настільних Рольових Іграх (НРІ)?\n\n❗Якщо ти ще не знаєш що це - обов'язково ознайомся з <a href=\"https://nri.fandom.com/uk/wiki/%D0%9D%D0%B0%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D1%96_%D1%80%D0%BE%D0%BB%D1%8C%D0%BE%D0%B2%D1%96_%D1%96%D0%B3%D1%80%D0%B8\">ЦІЄЮ СТАТТЕЮ</a> перед тим, як продовжити!";
  },
  [
    [["🎲 Маю досвід гри", PLAYED.has_experience]],
    [["👍Не маю досвіду, але цікаво", PLAYED.no_experience]],
    [["⬅️Назад", CONTROL.back]],
  ],
  saveValue("form:played", CONTROL.back)
);

export const $gamesPlayed = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 Скільки в тебе досвіду в НРІ як у гравця?"
  },
  [
    [["До 5 сесій", 5]],
    [["Від 6 до 10 сесій", 10]],
    [["Від 11 до 50 сесій", 50]],
    [["Понад 50 сесій", 100]],
    [["⬅️Назад", CONTROL.back]],
  ],
  saveValue("form:gamesPlayed", CONTROL.back),
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
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 У яких Настільних Рольових Системах ти маєш досвід як гравець?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> " + list.join(";");
  },
  toggleButtons<StateType>(
    "form:systemsPlayed", 
    async state => {
      const buttons = state.data.storage.systems.map(s => {
        return [[s.name, s.id]];
      }) as keyboard;
      return [
        ...buttons, 
        [["⬅️Назад", CONTROL.back], ["➡️Далі", CONTROL.next]]
      ];
    },
    "✅ ",
    "",
    CONTROL.back, CONTROL.next),
  text(),
  toggleValue("form:systemsPlayed", CONTROL.back, CONTROL.next),
  toggleValueInput("form:systemsPlayed")
);

export const $playGameTypes = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 У які види НРІ тебе цікавлять як гравця?\n\n<b>ℹ️ Сесія</b> - зазвичай триває 3-6 годин\n<b>ℹ️ Ваншот</b> - цілісна гра на одну сесію\n<b>ℹ️ Міні-кампанія</b> - гра до 5 сесій\n<b>ℹ️ Кампанія</b> - гра, що триває більше 5 сесій і може тривати й роками.";
  },
  toggleButtons(
    "form:playGameTypes", 
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Довгі кампанії", GAME_TYPES.long_campaign]],
      [["⬅️Назад", CONTROL.back], ["➡️Далі", CONTROL.next]]
    ], 
    "✅ ",
    "", 
    CONTROL.back, CONTROL.next),
  toggleValue("form:playGameTypes", CONTROL.back, CONTROL.next)
);

export const $mastered = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 Чи є в тебе досвід проведення власних ігор (як майстер)?\n\nℹ️ Майстер - це ведучий гри, що відповідає за правила, світ та неігрових персонажів у ньому.";
  },
  [
    [["Проводив(ла/ли) ігри", MASTERED.is_master]],
    [["Хочу спробувати провести", MASTERED.wants_master]],
    [["Не проводив(ла/ли) ігри й не хочу", MASTERED.no_master]],
    [["⬅️Назад", CONTROL.back]],
  ],
  saveValue("form:mastered", CONTROL.back)
);

export const $gamesMastered = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 Скільки сесій ти провів/провела/провели як майстер?";
  },
  [
    [["До 5 сесій", 5]],
    [["Від 6 до 10 сесій", 10]],
    [["Від 11 до 50 сесій", 50]],
    [["Понад 50 сесій", 100]],
    [["⬅️Назад", CONTROL.back]],
  ],
  saveValue("form:gamesMastered", CONTROL.back)
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
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\n🎲 Які Настільні Рольові Системи ти водив(ла/ли)?\n\nℹ️ Ти можеш додати власні варіанти, ввівши їх у повідомленні.\nℹ️ Щоб прибрати введений вручну варіант, введи його назву ще раз!\n\n✍️<b>Введені вручну:</b> " + list.join(";");
  },
  toggleButtons<StateType>(
    "form:systemsMastered", 
    async state => {
      const buttons = state.data.storage.systems.map(s => {
        return [[s.name, s.id]];
      }) as keyboard;
      return [
        ...buttons, 
        [["⬅️Назад", CONTROL.back], ["➡️Далі", CONTROL.next]]
      ];
    }, 
    "✅ ",
    "", 
    CONTROL.back, CONTROL.next),
  text(),
  toggleValue("form:systemsMastered", CONTROL.back, CONTROL.next),
  toggleValueInput("form:systemsMastered")
);

export const $masterGameTypes = optionsField(
  async state => {
    return "<b><u>👤Реєстрація: Досвід в НРІ</u></b>\n\nЯкі види НРІ ти хочеш водити як майстер?\n\nℹ️ <b>Сесія</b> - зазвичай триває 3-6 годин\nℹ️ <b>Ваншот</b> - цілісна гра на одну сесію\n<b>Міні-кампанія</b> - гра до 5 сесій\nℹ️ <b>Кампанія</b> - гра, що триває більше 5 сесій і може тривати роками."
  },
  toggleButtons(
    "form:masterGameTypes", 
    [
      [["Ваншоти", GAME_TYPES.one_shot]],
      [["Міні-кампанії", GAME_TYPES.short_campaign]],
      [["Довгі кампанії", GAME_TYPES.long_campaign]],
      [["⬅️Назад", CONTROL.back], ["➡️Далі", CONTROL.next]],
    ], 
    "✅ ",
    "", 
    CONTROL.back, CONTROL.next),
  toggleValue("form:masterGameTypes", CONTROL.back, CONTROL.next)
);

export const $formDone = optionsField<StateType>(
  async state => {
    // fetch land's name
    return `<b><u>👤Реєстрація: Захист Даних</u></b>\n\n✔️Всі поля заповнено!\n\nℹ️ Щоб завершити реєстрацію дай дозвіл на обробку цих даних Центральною Радою Мрієтворців та Координаційним Органом Осередку Мрієтворців "${"Berlin"}"`;
  },
  [
    [["⬅️Назад", CONTROL.back], ["✅ Даю дозвіл!", CONTROL.next]],
  ],
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    if(data !== CONTROL.next) return;

    const systemsPlayed: number[] = [];
    const systemsMastered: number[] = [];

    const customSystemsPlayed: string[] = [];
    const customSystemsMastered: string[] = [];

    const playGameTypes: UserDurationPreference[] = [];
    const masterGameTypes: UserDurationPreference[] = [];

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
      state.data.options["form:username"],
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
      state.data.options["form:gamesPlayed"] ?? 0
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
      state.data.options["form:gamesMastered"] ?? 0,

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
    return "<b><u>✅ Реєстрацію завершено</u></b>\n\nℹ️ Приєднуйся до чатів свого Осередку Мрієтворців!\n\n👉Чат 1\n👉Чат 2\n👉Чат 3";
  },
  [
    [["Головне меню", CONTROL.back]],
  ]
);
