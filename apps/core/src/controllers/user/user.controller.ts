import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameSystem, Land, Member, User } from "../../entities";
import { In, Repository } from "typeorm";
import { CreateUserDto, SetUserPreferencesDto, JoinLandDto, SetLandAdminDto } from "./dtos";
import { CreateUserQuery, FindUserQuery } from "./queries";
import { UserNotFoundException } from "./exceptions";
import { LandNotFoundException } from "../land/exceptions";

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(GameSystem)
    private readonly gameSystemRepository: Repository<GameSystem>,
    @InjectRepository(Land)
    private readonly landRepository: Repository<Land>,
  ) {}

  @Get()
  async find(@Query() query: FindUserQuery): Promise<User[]> {
    return this.userRepository.find({ 
      where: query, 
      order: { id: 'ASC' },
      skip: query.pageIndex * query.pageSize,
      take: query.pageSize,
    });
  }

  @Get('byTelegramId/:telegramId')
  async findOneByTelegram (@Param('telegramId', ParseIntPipe) telegramId: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { telegramId }, 
      relations: ['playerPreferredGameSystems', 'masterPreferredGameSystems', 'memberships'],
    });
    if (!user) throw new UserNotFoundException(telegramId, "telegram");
    return user;
  }

  @Get(':userId')
  async findOne(@Param('userId', ParseIntPipe) id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id }, 
      relations: ['playerPreferredGameSystems', 'masterPreferredGameSystems', 'memberships'],
    });
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  @Post()
  async create(@Query() query: CreateUserQuery, @Body() body: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      ...query,
      ...body,
    });
  }

  @Put(':userId/preferences/player')
  async setPlayerPreferences(@Param('userId', ParseIntPipe) id: number, @Body() body: SetUserPreferencesDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UserNotFoundException(id);

    const gameSystems = await this.gameSystemRepository.findBy({ id: In(body.gameSystemIds) });
    if (!gameSystems.length) {
      throw new BadRequestException('No game systems found for the provided IDs');
    }

    user.playerPreferredGameSystems = gameSystems;
    user.playerPreferredDuration = body.durations;

    return await this.userRepository.save(user);
  }

  @Put(':userId/preferences/master')
  async setMasterPreferences(@Param('userId', ParseIntPipe) id: number, @Body() body: SetUserPreferencesDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UserNotFoundException(id);

    const gameSystems = await this.gameSystemRepository.findBy({ id: In(body.gameSystemIds) });
    if (!gameSystems.length) {
      throw new BadRequestException('No game systems found for the provided IDs');
    }

    user.masterPreferredGameSystems = gameSystems;
    user.masterPreferredDuration = body.durations;

    return await this.userRepository.save(user);
  }

  @Post(':userId/memberships')
  async joinLand(@Param('userId', ParseIntPipe) id: number, @Body() body: JoinLandDto): Promise<Member> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new UserNotFoundException(id);

    const land = await this.landRepository.findOneBy({ id: body.landId });
    if (!land) throw new LandNotFoundException(body.landId);

    const existingMember = await this.memberRepository.findOneBy({ userId: id, landId: body.landId });
    if (existingMember) throw new BadRequestException('User is already a member of this land');

    return this.memberRepository.create({
      user,
      land,
      status: body.status,
      isLandAdmin: false,
    });
  }

  @Put(':userId/memberships/:landId/land-admin')
  async setLandAdmin(
    @Param('userId', ParseIntPipe) userId: number, 
    @Param('landId', ParseIntPipe) landId: number,
    @Body() body: SetLandAdminDto,
  ): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ userId, landId });
    if (!member) throw new BadRequestException('User is not a member of this land');

    member.isLandAdmin = body.isLandAdmin;
    return this.memberRepository.save(member);
  }

  @Delete(':userId/memberships/:landId')
  async leaveLand(
    @Param('userId', ParseIntPipe) userId: number, 
    @Param('landId', ParseIntPipe) landId: number,
  ): Promise<void> {
    const member = await this.memberRepository.findOneBy({ userId, landId });
    if (!member) throw new BadRequestException('User is not a member of this land');
    this.memberRepository.delete(member);
  }
}
