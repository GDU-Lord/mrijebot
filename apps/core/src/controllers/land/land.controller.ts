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

  @Post()
  async createLand(@Body() body: CreateLandDto) {
    console.log('Received data:', body);
    this.landRepository.save(body);
  }
 
}
