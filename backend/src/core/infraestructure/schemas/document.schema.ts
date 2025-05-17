import { DocumentType } from "src/core/domain/models/document_types.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const ConventionySchema = new EntitySchema<DocumentType>({
	tableName: "document_types",
	name: "DocumentType",
	target: DocumentType,
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
        description: {
			type: "character varying",
			length: 200,
		},
	},
});
