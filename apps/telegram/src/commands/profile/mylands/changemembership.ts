import { Land } from "../../../../../core/src/entities/land.entity";
import { assignGlobalRole, createAnnouncement, createRequest, getLands, getRoleAssignees, setAnnouncementStatus } from "../../../api";
import { getLastCallback, keyboard } from "../../../custom/hooks/buttons";
import { saveValue } from "../../../custom/hooks/options";
import { StateType } from "../../../custom/hooks/state";
import { CONTROL } from "../../mapping";
import { optionsField } from "../../presets/options";

export const $changeMembership = optionsField<StateType>(
  async state => {
    const lands = state.data.options["profile:becomeParticipantLands"] = (await getLands())
      .filter(l => l.members.filter(
        m => m.userId === state.data.storage.user?.id && m.status === "participant"
      ).length === 0);
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Зауваж, що запит на зміну свого осередку реєстрації — це незворотня дія.\n❗Твій запит буде передано Координаційному Органу новообраного осередку.\n❗Дію твого акаунту в системі Мрієтворців буде призупинено до підтвердження або відхилення цього запиту!\n\nЯкщо ти ДІЙСНО хочеш продовжити, обери відповідний осередок зі списку:`;
  },
  async state => {
    const lands = state.data.options["profile:becomeParticipantLands"] as Land[] ?? [];
    const buttons = lands.map(l => [[l.name, l.id]]) as keyboard;
    return [
      ...buttons,
      [["⬅️Назад", CONTROL.back]]
    ]
  },
  saveValue("profile:becomeParticipantLandId", CONTROL.back)
);

export const $landChangeProceed = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Ти дійсно хочеш зробити запит на зміну осередку реєстрації? Тобою обрано осередок "Berlin" (Berlin, Brandenburg)`;
  },
  async state => {
    return [
      [["❗Продовжити", CONTROL.next]],
      [["❌Скасувати", CONTROL.back]]
    ]
  },
  async (state, buttons) => {
    const data = getLastCallback(state, buttons);
    const user = state.data.storage.user;
    if(!user) return;
    if(data !== CONTROL.next) return;
    // change here
    const member = user.memberships.find(m => m.status === "participant");
    if(!member) return;
    const localAdminRole = state.data.storage.roles.find(r => r.tag === "local_admin");
    if(!localAdminRole) return;
    const res = await createRequest("move_out", {
      from: { member },
      to: {
        role: localAdminRole
      },
      content: String(state.data.options["profile:becomeParticipantLandId"])
    });
    if(!res) return;

    const suspendedRole = state.data.storage.roles.find(r => r.tag === "suspended");
    if(!suspendedRole) return;
    await assignGlobalRole(suspendedRole?.id, user.id);

    let { members } = await getRoleAssignees(localAdminRole.id) ?? {};
    members = members?.filter(m => m.landId === member.landId);
    const notification = await createAnnouncement("private", `#система\n\nКористувач хоче покинути твій Осередок!\n\nПерейди у <b>МРІЄБОТ > Профіль > Мої Осередки > [ТВІЙ ОСЕРЕДОК] > Запити</b>`, {
      memberIds: members?.map(m => m.id)
    });
    if(notification) await setAnnouncementStatus(notification.id, "pending");
  }
);

export const $landChanged = optionsField<StateType>(
  async state => {
    return `<b><u>👤Профіль: Зміна осередку</u></b>\n\n❗Запит на зміну осередку відправлено! Дію твого акаунту тимчасово призупинено. За потреби ти все ще можеш зв'язатися нашою командою!`;
  },
  [
    [["⬅️Головне меню", CONTROL.back]],
  ]
);