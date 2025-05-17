import type { Users } from '@models/user.model';
import { generalStateTypes } from '@enums/general-state-type';
import { dataPaginationResponse } from '@models/app.model';

export interface UsersRepository {
    getAll(filter?: any): Promise<Users[] | dataPaginationResponse>;
    findByNameIdentification(text?: string): Promise<Users[] | null>;
    findById(id: string): Promise<Users | null>;
    create(user: Users): Promise<Users>;
    update(id: string, user: Partial<Users>): Promise<Users>;
    changeState(id: string, state: generalStateTypes): Promise<Users>;
    findByUsername(username: string): Promise<Users | null>;
    findByEmail(email: string): Promise<Users | null>;
}