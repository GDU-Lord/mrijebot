import { NotFoundException } from "@nestjs/common";

export class GameSystemNotFound extends NotFoundException {
  constructor(name: string) {
    super(`Land with name ${name} not found`);
  }
}
