import  { GrupoServicio } from "@models/grupo-servicio.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const GrupoServicioSchema = new EntitySchema<GrupoServicio>({
  tableName: "grupos_servicio",
  name: "GrupoServicio",
  target: GrupoServicio,
  columns: {
    ...BaseSchema,
    name: {
      type: "character varying",
      length: 100,
    },
    code: {
      name: "code",
      type: "character varying",
      length: 100,
    },
    siglas: {
        name: "siglas",
        type: "character varying",
        length: 10,
      },
    state: {
      type: "enum",
      enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
      default: "ACTIVO",
    },
  },
  relations: {
    servicios: {
      target: "Servicio",
      type: "one-to-many",
      inverseSide: "grupoServicio",
    },
  },
});
