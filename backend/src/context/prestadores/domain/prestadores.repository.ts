import type { Prestador } from '@models/prestador.model';

export interface PrestadorRepository {
  getAll(updated?, active?): Promise<Prestador[] | null>;
  findByNameIdentification(text?: string): Promise<Prestador[] | null>;
}
