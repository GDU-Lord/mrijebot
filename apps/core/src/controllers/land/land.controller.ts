import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameSystem, Land, Member, User } from "../../entities";
import { In, Repository } from "typeorm";
import { CreateLandDto } from "./dtos/create-land.dto";

@Controller('lands')
export class LandController {
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
  async getLands() {
    return await this.landRepository.find({
      order: {
        id: 'ASC'
      },
      relations: ['members']
    });
  }

  @Get(':landId')
  async getLand(@Param('landId', ParseIntPipe) id: number) {
    return await this.landRepository.findOne({
      where: { id },
      relations: ["members"],
    });
  }

  @Get('member/:memberId')
  async getMember(@Param('memberId', ParseIntPipe) id: number) {
    return await this.memberRepository.findOne({
      where: { id },
      relations: ["localRoles"],
    });
  }

  @Post()
  async createLand(@Body() body: CreateLandDto) {
    this.landRepository.save(body);
  }

  @Get(':landId/names')
  async getMemberNames(@Param('landId', ParseIntPipe) id: number) {
    const land = await this.landRepository.findOne({
      where: { id },
      order: {
        id: 'ASC'
      },
      select: {
        members: true
      },
      relations: ["members"]
    });
    return land?.members;
  }
 
}
