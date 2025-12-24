import { api } from ".";
import { CreateAnnouncementDto } from "../../../core/src/controllers/announcement/dtos/create-announcement.dto";
import { UpdateAnnouncementDto } from "../../../core/src/controllers/announcement/dtos/update-announcement.dto";
import { GetAnnouncementsQuery } from "../../../core/src/controllers/announcement/queries/get-announcements.query";
import { User } from "../../../core/src/entities";
import { Announcement, announcementStatus, announcementType } from "../../../core/src/entities/announcement.entity";

export async function createAnnouncement(
  tag: announcementType,
  text: string,
  to: {
    roleIds?: number[],
    memberIds?: number[],
    userIds?: number[],
    landIds?: number[],
  },
  owner?: User,
  data?: Record<string, any>,
) {
  const body: CreateAnnouncementDto = {
    ownerId: owner?.id,
    data,
    tag,
    text,
    roleIds: to.roleIds,
    memberIds: to.memberIds,
    userIds: to.userIds,
    landIds: to.landIds,
  };
  return await api.post<Announcement>("/announcements", body, {}, (err) => console.log(err));
}

export async function setAnnouncementStatus(id: number, status: announcementStatus) {
  const data: UpdateAnnouncementDto = { status };
  return await api.put("/announcements/" + id, data, {}, err => console.log(err));
}

export async function setAnnouncementText(id: number, text: string) {
  const data: UpdateAnnouncementDto = { text, status: "edit" };
  return await api.put("/announcements/" + id, data, {}, err => console.log(err));
}

export async function getUserAnnouncements(ownerId: number) {
  return await api.get<Announcement[]>("/announcements", {
    ownerId,
    status: "sent",
  } as GetAnnouncementsQuery, (err) => console.log(err));
}

export async function getLocalAnnouncements(landId: number) {
  return await api.get<Announcement[]>("/announcements", {
    landId,
    status: "sent",
  } as GetAnnouncementsQuery, (err) => console.log(err));
}

export async function getAnnouncement(id: number): Promise<Announcement | null> {
  return (await api.get<Announcement[]>("/announcements", {
    id
  } as GetAnnouncementsQuery, (err) => console.log(err)) ?? [])[0];
}