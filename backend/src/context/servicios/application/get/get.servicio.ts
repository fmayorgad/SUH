import { Injectable, Inject } from '@nestjs/common';
import { ServicioRepository } from '../../domain/servicio.repository';
import { GetServicioDTO } from '../../infraestructure/dto/get.servicio.dto';
import { Servicio } from '@models/servicio.model';
import { dataPaginationResponse } from '@models/app.model';

@Injectable()
export class GetServicios {
  constructor(
    @Inject('servicioRepository') // Use the provider token
    private readonly repository: ServicioRepository,
  ) {}

  async run(filter: GetServicioDTO): Promise<Servicio[] | dataPaginationResponse> {
    return await this.repository.getAll(filter);
  }
} 