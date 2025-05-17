import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrestadorRepository } from '@context/prestadores/domain/prestadores.repository';
import type { Prestador } from '@models/prestador.model';

@Injectable()
export class FindByNameIdentification {
  constructor(@Inject('prestadorRepository') private readonly prestadorRepository: PrestadorRepository) {}

  async execute(text: string): Promise<Prestador[] | null> {
    return await this.prestadorRepository.findByNameIdentification(text);
  }
}
