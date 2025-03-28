import { NotFoundException } from "@nestjs/common";

export type UserNotFoundType = 'user' | 'telegram' | 'discord';

export class UserNotFoundException extends NotFoundException {
  constructor(id: number, type: UserNotFoundType = 'user') {
    super(`User with ${type} ID ${id} not found`);
  }
}
