import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrestadorRepository } from '@context/prestadores/domain/prestadores.repository';
import type { Prestador } from '@models/prestador.model';

@Injectable()
export class GetAll {
  constructor(@Inject('prestadorRepository') private readonly prestadorRepository: PrestadorRepository) {}

  async execute(updated :string , active: Prestador[]): Promise<Prestador[] | null> {
    return await this.prestadorRepository.getAll(updated, active);
  }
}
