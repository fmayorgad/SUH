import { genSaltSync, hashSync } from 'bcrypt';
import { Users } from "src/core/domain/models/user.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";

export const UserSchema = new EntitySchema<Users>({
	tableName: "users",
	name: "Users",
	target: Users,
	columns: {
		...BaseSchema,
		name: {
			type: "character varying",
			length: 100,
		},
		surname: {
			type: "character varying",
			length: 100,
		},
        lastname: {
			type: "character varying",
			length: 100,
		},
        birthday: {
            type: 'date'
        },
		state: {
			type: "enum",
			enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
			default: "ACTIVO",
		},
        gender: {
			type: "enum",
			enum: ["MASCULINO", "FEMENINO", "OTRO"],
			default: "MASCULINO",
		},
        identification_type: {
			type: "enum",
			enum: ["CEDULA", "CEDULA EXTRANJERIA", "PASAPORTE", "OTRO"],
			default: "CEDULA",
		},
        identification_number: {
			type: "character varying",
			length: 100,
		},
        username: {
			type: "character varying",
			length: 100,
		},
        password: {
			type: String,
			length: 200,
			transformer: {
			  from: (value: string) => value,
			  to: (value: string) => {
			    // Only hash if password value is provided and not empty
			    if (value && value.trim() !== '') {
			      return hashSync(value, genSaltSync());
			    }
			    return value;
			  },
			},
			select: false,
		  },
        status: {
            type: "enum",
            enum: ["CONTRATISTA", "PROFESIONAL UNIVERSITARIO", "PROFESIONAL ESPECIALIZADO"],
            default: "CONTRATISTA",
        },
        planta_code: {
			type: "character varying",
			length: 100,
		},
        profile: {
			type: "uuid",
			nullable: false,
		},
        phone: {
			type: "character varying",
			length: 20,
		},
        email: {
			type: "character varying",
			length: 100,
		},
	},
	relations: {
		profile: {
		  type: 'many-to-one',
		  target: 'Profile',
		  joinColumn: {
			name: 'profile',
			referencedColumnName: 'id',
		  },
		},
		ledWeekgroupVisits: {
		  type: 'one-to-many',
		  target: 'WeekgroupVisit',
		  inverseSide: 'lead',
		},
		visitVerificadores: {
		  type: 'one-to-many',
		  target: 'VisitVerificadores',
		  inverseSide: 'user_id',
		},
	  },
});
