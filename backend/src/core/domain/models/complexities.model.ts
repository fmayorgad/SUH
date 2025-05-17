import { BaseModel } from "./base.model";
import type { generalStateTypes } from "@enums/general-state-type";
export class Complexity extends BaseModel {
	name!: string;
    state!: generalStateTypes;
    code!: string;
}
