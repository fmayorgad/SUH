import { BaseModel } from "@models/base.model";
import { Prestador } from "./prestador.model";
import { FiscalYear } from "./fiscalyears.model";
import { Municipio } from "./municipio.model";

export class PrestadorFiscalyearInformation extends BaseModel {
  prestador_id?: string;
  fiscal_year_id?: string;
  municipio_id?: string;
  correoPrestador?: string;
  telefonoPrestador?: string;
  codigoSede?: string;
  nombreSede?: string;
  correoSede?: string;
  telefonoSede?: string;
  direccionSede?: string;
  nombre_prestador?: string;

  habi_codigo_habilitacion?: string;
  codigo_habilitacion?: string;
  numero_sede?: string;
  nits_nit?: string;
  dv?: string;
  representante_legal?: string;
  correoRepresentante?: string;

  //foreign keys
  municipio?: Municipio;
  prestador!: Prestador;
  fiscalYear!: FiscalYear;
} 