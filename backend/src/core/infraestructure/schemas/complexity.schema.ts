import { Complexity } from "src/core/domain/models/complexities.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const ComplexitySchema = new EntitySchema<Complexity>({
  tableName: "complexities",
  name: "Complexity",
  target: Complexity,
  columns: {
    ...BaseSchema,
    name: {
      type: "character varying",
      length: 100,
    },
    code: {
      name: "code",
      type: "character varying",
      length: 50,
    },
    state: {
      type: "enum",
      enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
      default: "ACTIVO",
    },
  },
});
