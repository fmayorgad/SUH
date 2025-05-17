import { BaseModel } from "./base.model";
import  { generalStateTypes } from "@enums/general-state-type";
import  { Prestador } from "@models/prestador.model";

export class PrestadorType extends BaseModel {
	name!: string;
	state!: generalStateTypes;
	code!: string;
	prestador?: Prestador[];
}
