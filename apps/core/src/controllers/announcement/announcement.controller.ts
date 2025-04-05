import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query } from "@nestjs/common";
import { CreateAnnouncementDto } from "./dtos/create-announcement.dto";
import { In, Repository } from "typeorm";
import { Announcement } from "../../entities/announcement.entity";
import { User } from "../../entities";
import { GetAnnouncementsQuery } from "./queries/get-announcements.query";
import { UpdateAnnouncementDto } from "./dtos/update-announcement.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Controller("announcements")
export class AnnouncementController {

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get("updates")
  async getUpdates () {
    return await this.announcementRepository.find({
      where: {
        status: In(["pending", "edit", "archive"])
      },
    });
  }

  @Get()
  async getAnnouncements (
    @Query() query: GetAnnouncementsQuery
  ) {

    const { tag, id, status } = query;
    const data: Record<string, any> = {};

    if(query.landId)
      data["landIds"] = query.landId;
    if(query.memberId)
      data["memberIds"] = query.memberId;
    if(query.userId)
      data["userIds"] = query.userId;
    if(query.roleId)
      data["roleIds"] = query.roleId;

    if(query.ownerId) {
      const owner = await this.userRepository.findOneBy({ id: query.ownerId });
      if(!owner) throw new NotFoundException(`User with id ${query.ownerId} not found!`);
      data["owner"] = owner;
    }

    return await this.announcementRepository.find({
      where: {
        ...data,
        tag,
        id,
        status,
      }
    });

  }

  @Post()
  async createAnnouncement (
    @Body() body: CreateAnnouncementDto
  ) {
    
    let owner: User | null = null;
    if(body.ownerId) {
      owner = await this.userRepository.findOneBy({ id: body.ownerId });
      if(!owner) throw new NotFoundException(`User with id ${body.ownerId} not found!`);
    }
    
    return await this.announcementRepository.save({
      tag: body.tag,
      status: "pending",
      text: body.text,
      date: new Date(),
      data: body.data,
      roleIds: body.roleIds,
      memberIds: body.memberIds,
      userIds: body.userIds,
      landIds: body.landIds,
      recepientIds: [] as string[],
      instanceIds: [] as string[],
      owner,
    } as Announcement);

  }

  @Put(':announcementId')
  async updateAnnouncement(
    @Param('announcementId') id: number,
    @Body() body: UpdateAnnouncementDto
  ) {
    
    const announcement = await this.announcementRepository.findOneBy({ id });
    if(!announcement) throw new NotFoundException(`Announcement with id ${id} not found!`);

    announcement.instanceIds.push(...body.instanceIds);
    announcement.recepientIds.push(...body.recepientIds);

    announcement.text = body.text ?? announcement.text;
    announcement.data = body.data ?? announcement.data;
    announcement.status = body.status ?? announcement.status;

    return await this.announcementRepository.save(announcement);

  }

}