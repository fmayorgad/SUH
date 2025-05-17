import { Servicio } from '@models/servicio.model';
import { GetServicioDTO } from '../infraestructure/dto/get.servicio.dto';
import { dataPaginationResponse } from '@models/app.model';

export interface ServicioRepository {
  getAll(filter: GetServicioDTO): Promise<Servicio[] | dataPaginationResponse>;
  findById(id: string): Promise<Servicio | null>;
  // Add create, update, delete methods as needed
} 