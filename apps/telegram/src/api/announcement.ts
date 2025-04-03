import { api } from ".";
import { CreateAnnouncementDto } from "../../../core/src/controllers/announcement/dtos/create-announcement.dto";
import { User } from "../../../core/src/entities";
import { announcementType } from "../../../core/src/entities/announcement.entity";

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
    memberIds: to.roleIds,
    userIds: to.userIds,
    landIds: to.landIds,
  };
  return await api.post("/announcements", body, {}, (err) => console.log(err));
}