import { Profile } from "src/core/domain/models/profile.model";
import { EntitySchema } from "typeorm";
import { BaseSchema } from "@schemas/base.schema";
import {ProfilesEnum} from "@enums/profiles";

export const ProfileSchema = new EntitySchema<Profile>({
	tableName: "profiles",
	name: "Profile",
	target: Profile,
	columns: {
		...BaseSchema,
		name: {
			type: "character varying",
			length: 100,
		},
		state: {
			type: "enum",
			enum: ["ACTIVO", "INACTIVO", "ELIMINADO"],
			default: "ACTIVO",
		},
		enumName: {
			type: "enum",
			enum:  ProfilesEnum,
			default: "ACTIVO",
		},
	},
	relations: {
		users: {
		  type: 'one-to-many',
		  target: 'Users',
		},
		modules: {
		  type: 'many-to-many',
		  target: 'Module',
		  joinTable: {
			name: 'profile_module_permission',
			joinColumn: {
			  name: 'profile_id',
			  referencedColumnName: 'id',
			},
			inverseJoinColumn: {
			  name: 'module_id',
			  referencedColumnName: 'id',
			},
		  },
		},
	  },
});
