import { NotFoundException } from "@nestjs/common";

export class LandNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Land with ID ${id} not found`);
  }
}
