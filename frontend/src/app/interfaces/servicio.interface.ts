export interface Servicio {
  id: string;
  code: string;
  name: string;
  grupoServicio: Record<string, any>;
  // Any other properties that might be relevant
}

export interface ServicioResponse {
  data: Servicio[];
  total: number;
  ok: boolean;
  description?: string;
} 