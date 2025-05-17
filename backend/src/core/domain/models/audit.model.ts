import { BaseModel } from '@models/base.model';
import { Users } from '@models/user.model';

export class Audit extends BaseModel {
    executes: string;
    payload?: string;
    executedBy?: Users; 
    date: Date;
    action?: string;
}
