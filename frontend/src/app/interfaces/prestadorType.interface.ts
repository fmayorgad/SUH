import type { generalStateTypes } from '@interfaces/general.interface';

export class PrestadorType {
    id: string;
	name!: string;
	state!: generalStateTypes;
	code!: string;
}
