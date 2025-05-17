
import type { generalStateTypes } from "@enums/general-state-type";
import type { Municipio } from "@models/municipio.model";
export class Departamento  {
    id!: string;
	name!: string;
    state!: generalStateTypes;
    code!: string;
    region!: string;
    real_code!: string;
    municipios!: Municipio[];
}
