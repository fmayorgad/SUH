import { BadRequestException } from '@nestjs/common';

export class IncorrectUserOrPasswordException extends BadRequestException {
  constructor() {
    super('Usuario y/o contraseña incorrectos');
  }
}
