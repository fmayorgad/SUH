
import type { generalStateTypes } from "@enums/general-state-type";
import { Servicio } from "./servicio.model";

export class GrupoServicio {
    id: string;
	name!: string;
    state!: generalStateTypes;
    code!: string;
    siglas!: string;

    servicios!: Servicio[];
}
