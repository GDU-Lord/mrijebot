import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Land, User } from "../../entities";
import { Repository } from "typeorm";
import { Chat } from "../../entities/chat.entity";
import { AddChatDto } from "./dtos/add-chat.dto";

@Controller('chats')
export class ChatController {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Land)
    private readonly landRepository: Repository<Land>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  @Get()
  async getAllChats() {
    return await this.chatRepository.find({
      relations: ["users", "land"]
    });
  }

  @Get('land/:landId')
  async getChatByLand(@Param('landId') id: number) {

    return await this.chatRepository.find({
      where: { land: { id } },
      order: {
        id: 'ASC'
      },
      relations: ["users", "land"]
    });

  }

  @Post()
  async addChat(@Body() body: AddChatDto) {
    const { chatId, title, landId, invite } = body;
    const data = { chatId, title, invite } as Chat;
    if(landId) {
      const land = await this.landRepository.findOneBy({ id: landId });
      if(!land) throw new NotFoundException(`Land with id ${landId} not found!`);
      data.land = land;
    }
    return await this.chatRepository.save(data);
  }

  @Put("edit/:id")
  async editChat(@Param('id', ParseIntPipe) id: number, @Body() body: AddChatDto) {
    const { chatId, title, landId, invite } = body;
    const data = await this.chatRepository.findOneBy({ id });
    if(!data) throw new NotFoundException(`Chat with id ${id} not found!`);
    data.chatId = chatId;
    data.title = title;
    data.invite = invite;
    if(landId) {
      const land = await this.landRepository.findOneBy({ id: landId });
      if(!land) throw new NotFoundException(`Land with id ${landId} not found!`);
      data.land = land;
    }
    else data.land = null;
    return await this.chatRepository.save(data);
  }

  @Put(':chatId/add/:userId')
  async addUser(@Param('chatId') id: number, @Param('userId') userId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ["users"],
    });
    if(!chat || chat.users.find(u => u.id === userId)) throw new BadRequestException(`Bad request with chatId ${id} and userId ${userId}`);
    const user = await this.userRepository.findOneBy({ id: userId });
    if(!user) throw new NotFoundException(`User ${userId} not found!`);
    chat.users.push(user);
    return await this.chatRepository.save(chat);
  }

  @Delete(':chatId/remove/:userId')
  async removeUser(@Param('chatId') id: number, @Param('userId') userId: number) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ["users"],
    });
    if(!chat) throw new NotFoundException(`Chat ${id} not found!`);
    const index = chat.users.findIndex(u => u.id === userId);
    if(index < 0) throw new BadRequestException(`Chat ${id} does not contain the User ${userId}`);
    chat.users.splice(index, 1);
    return await this.chatRepository.save(chat);
  }

  @Get('byChatId/:chatId')
  async getChatByChatId(@Param('chatId') chatId: string) {
    return await this.chatRepository.findOne({
      where: { chatId },
      relations: ["users", "land"],
    });
  }

}