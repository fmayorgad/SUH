import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ServicioRepository } from '../../domain/servicio.repository';
import { Servicio } from '@models/servicio.model';

@Injectable()
export class FindServicioById {
  constructor(
    @Inject('servicioRepository') // Use the provider token
    private readonly repository: ServicioRepository,
  ) {}

  async run(id: string): Promise<Servicio | null> {
    const servicio = await this.repository.findById(id);
    if (!servicio) {
      throw new NotFoundException(`Servicio with ID ${id} not found`);
    }
    return servicio;
  }
} 