import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameSystem, Land, Member, User } from "../../entities";
import { In, Repository } from "typeorm";
// import { CreateUserDto, SetUserPreferencesDto, JoinLandDto, SetLandAdminDto } from "./dtos";
// import { CreateUserQuery, FindUserQuery } from "./queries";
import { UserNotFoundException } from "../user/exceptions";
import { GameSystemNotFound } from "./exceptions";
import { CreateGameSystemDto } from "./dtos/create-game-system.dto";

@Controller('systems')
export class GameSystemController {
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
  async getGameSystems() {
    return await this.gameSystemRepository.find({
      order: {
        name: 'ASC'
      }
    });
  }

  @Post()
  async createSystem(@Body() body: CreateGameSystemDto) {
    console.log('Received data:', body);
    this.gameSystemRepository.save(body);
  }
 
}
