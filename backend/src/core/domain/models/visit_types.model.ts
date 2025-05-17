import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";

export class VisitType extends BaseModel {
	name!: string;
    state!: generalStateTypes;
    code!: string;
}
