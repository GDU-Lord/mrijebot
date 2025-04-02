import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Land, Member, User } from "../../entities";
import { Role } from "../../entities/role.entity";
import { In, Repository } from "typeorm";
import { GetRequestsQuery } from "./queries/get-requests.query";
import { Request, requestStatus } from "../../entities/request.entity";
import { CreateRequestDto } from "./dtos/create-request.dto";

@Controller('requests')
export class RequestController {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Land)
    private readonly landRepository: Repository<Land>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  @Get()
  async getRequests(@Query() query: GetRequestsQuery) {
    
    const data: {
      [key: string]: {
        id: number;
      } | string | number;
    } = {};

    if(query.fromRoleId)
      data.fromRole = { id: +query.fromRoleId };

    if(query.fromUserId)
      data.fromUser = { id: +query.fromUserId };

    if(query.fromMemberId)
      data.fromMember = { id: +query.fromMemberId };

    if(query.fromLandId)
      data.fromLand = { id: +query.fromLandId };

    if(query.toRoleId)
      data.toRole = { id: +query.toRoleId };

    if(query.toUserId)
      data.toUser = { id: +query.toUserId };

    if(query.toMemberId)
      data.toMember = { id: +query.toMemberId };

    if(query.toLandId)
      data.toLand = { id: +query.toLandId };

    if(query.id)
      data.id = +query.id;

    if(query.status)
      data.status = query.status;

    if(query.tag)
      data.tag = query.tag;

    if(query.content)
      data.content = query.content;

    console.log("rec", data);

    return await this.requestRepository.find({ 
      where: data,
      relations: ["fromRole", "fromUser", "fromMember", "fromLand", "toRole", "toUser", "toMember", "toLand", "signatures"],
    });

  }

  @Post()
  async createRequest(@Body() {
    fromLand,
    fromMember,
    fromRole,
    fromUser,
    toLand,
    toMember,
    toRole,
    toUser,
    signatures,
    tag,
    status,
  }: CreateRequestDto) {
    return await this.requestRepository.save({
      tag,
      status,
      fromLand: fromLand ? await this.landRepository.findOneBy({ id: fromLand }) : null,
      fromMember: fromMember ? await this.memberRepository.findOneBy({ id: fromMember }) : null,
      fromRole: fromRole ? await this.roleRepository.findOneBy({ id: fromRole }) : null,
      fromUser: fromUser ? await this.userRepository.findOneBy({ id: fromUser }) : null,
      toLand: toLand ? await this.landRepository.findOneBy({ id: toLand }) : null,
      toMember: toMember ? await this.memberRepository.findOneBy({ id: toMember }) : null,
      toRole: toRole ? await this.roleRepository.findOneBy({ id: toRole }) : null,
      toUser: toUser ? await this.userRepository.findOneBy({ id: toUser }) : null,
      signatures: signatures ? await this.userRepository.findBy({ id: In(signatures) }) : [],
    });
  }

  @Put(':requestId/sign/:userId')
  async signRequest(
    @Param('requestId', ParseIntPipe) requestId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: ["signatures"],
    });
    if(!request) throw new NotFoundException(`Request with id ${requestId} not found!`);
    const user = await this.userRepository.findOneBy({ id: userId });
    if(!user) throw new NotFoundException(`User with id ${userId} not found!`);
    if(request.signatures.find(u => u.id === user.id)) throw new BadRequestException(`User with id ${userId} has already signed the Request with id ${requestId}!`);
    request.signatures.push(user);
    return await this.requestRepository.save(request);
  }

  @Put(':requestId/status/:status')
  async setStatus(
    @Param('requestId', ParseIntPipe) id: number,
    @Param('status') status: requestStatus,
  ) {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ["signatures"],
    });
    if(!request) throw new NotFoundException(`Request with id ${id} not found!`);
    if(request.status === status) throw new BadRequestException(`Request with id ${id} already has the status ${status}!`);
    request.status = status;
    return await this.requestRepository.save(request);
  }

}