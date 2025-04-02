import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Land, Member, User } from "../../entities";
import { Role, roleStatus, roleType } from "../../entities/role.entity";
import { In, Repository } from "typeorm";
import { CreateRoleDto } from "./dtos/create-role.dto";
import { EditRoleDto } from "./dtos/edit-role.dto";

@Controller('roles')
export class RoleController {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Land)
    private readonly landRepository: Repository<Land>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  @Get('global')
  async getGlobalRoles() {
    return await this.roleRepository.find({
      where: { type: In(["global", "hybrid"]) }
    });
  }

  @Get('local')
  async getLocalRoles() {
    return await this.roleRepository.find({
      where: { type: In(["local", "hybrid"]) }
    });
  }

  @Get('all')
  async getAllRoles() {
    return await this.roleRepository.find();
  }

  @Get('member/:memberId')
  async getMemberRoles(
    @Param('memberId') id: number
  ) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['localRoles']
    });
    if(!member) throw new NotFoundException(`Member with id ${id} not found!`);
    return member.localRoles;
  }

  @Post(':type/:status')
  async createRole(
    @Param('type') type: roleType,
    @Param('status') status: roleStatus,
    @Body() body: CreateRoleDto,
  ) {
    return await this.roleRepository.save({
      type,
      status,
      ...body,
    });
  }

  @Put(':roleId')
  async editRole(
    @Param('roleId') id: number,
    @Body() body: EditRoleDto,
  ) {
    const role = await this.roleRepository.findOneBy({ id });
    if(!role) throw new NotFoundException(`Role with id ${id} not found!`);

    role.link = body.link;
    role.name = body.name;
    role.publicName = body.publicName;
    role.rank = body.rank;
    role.shortName = body.shortName;
    role.shortPublicName = body.shortPublicName;
    role.status = body.status;
    role.tag = body.tag;
    role.type = body.type;

    return await this.roleRepository.save(role);
  }

  @Put(':roleId/member/:memberId')
  async assignLocalRole(
    @Param('roleId') roleId: number,
    @Param('memberId') memberId: number,
  ) {
    const role = await this.roleRepository.findOne({ 
      where: { id: roleId }
    });

    if(!role) throw new NotFoundException(`Role with id ${roleId} not found!`);
    if(role.type !== "local" && role.type !== "hybrid") throw new BadRequestException(`Role with id ${roleId} is not local!`);

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['localRoles']
    });
    if(!member) throw new NotFoundException(`Member with id ${memberId} not found!`);

    const memberRoleIds = member.localRoles.map(r => r.id);

    if(memberRoleIds.includes(role.id)) throw new BadRequestException(`Member with id ${memberId} already has the role with id ${roleId}`);

    member.localRoles.push(role);

    return await this.memberRepository.save(member);
  }

  @Delete(':roleId/member/:memberId')
  async removeLocalRole(
    @Param('roleId') roleId: number,
    @Param('memberId') memberId: number,
  ) {
    const role = await this.roleRepository.findOne({ 
      where: { id: roleId }
    });

    if(!role) throw new NotFoundException(`Role with id ${roleId} not found!`);
    if(role.type !== "local" && role.type !== "hybrid") throw new BadRequestException(`Role with id ${roleId} is not local!`);

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
      relations: ['localRoles']
    });
    if(!member) throw new NotFoundException(`Member with id ${memberId} not found!`);

    const memberRoleIds = member.localRoles.map(r => r.id);

    if(!memberRoleIds.includes(role.id)) throw new BadRequestException(`Member with id ${memberId} doesn't have the role with id ${roleId}`);

    const index = memberRoleIds.findIndex(id => id === role.id);
    member.localRoles.splice(index, 1);

    return await this.memberRepository.save(member);
  }

  @Put(':roleId/user/:userId')
  async assignGlobalRole(
    @Param('roleId') roleId: number,
    @Param('userId') userId: number,
  ) {
    const role = await this.roleRepository.findOne({ 
      where: { id: roleId }
    });

    if(!role) throw new NotFoundException(`Role with id ${roleId} not found!`);
    if(role.type !== "global" && role.type !== "hybrid") throw new BadRequestException(`Role with id ${roleId} is not local!`);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['globalRoles']
    });
    if(!user) throw new NotFoundException(`User with id ${userId} not found!`);

    const userRoleIds = user.globalRoles.map(r => r.id);

    if(userRoleIds.includes(role.id)) throw new BadRequestException(`User with id ${userId} already has the role with id ${roleId}`);

    user.globalRoles.push(role);

    await this.userRepository.save(user);
  }

  @Delete(':roleId/user/:userId')
  async removeGlobalRole(
    @Param('roleId') roleId: number,
    @Param('userId') userId: number,
  ) {
    const role = await this.roleRepository.findOne({ 
      where: { id: roleId }
    });

    if(!role) throw new NotFoundException(`Role with id ${roleId} not found!`);
    if(role.type !== "global" && role.type !== "hybrid") throw new BadRequestException(`Role with id ${roleId} is not local!`);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['globalRoles']
    });

    if(!user) throw new NotFoundException(`User with id ${userId} not found!`);

    const userRoleIds = user.globalRoles.map(r => r.id);

    if(!userRoleIds.includes(role.id)) throw new BadRequestException(`User with id ${userId} doesn't have the role with id ${roleId}`);

    const index = userRoleIds.findIndex(id => id === role.id);
    user.globalRoles.splice(index, 1);

    return await this.userRepository.save(user);
  }

  // @Delete(':roleId')
  // async deleteRole(
  //   @Param('roleId') id: number
  // ) {
  //   return await this.roleRepository.delete({ id });
  // }

}