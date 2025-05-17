import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { Audit } from "@models/audit.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuditService {
    constructor(@InjectRepository(Audit)
    private readonly repository: Repository<Audit>,
        private readonly jwtService: JwtService
    ) { }

    async execute(log: Audit) {
        console.log('creating log:>> ', log);
        const storedLog = this.repository.create(log);
        await this.repository.save(storedLog); 
        return storedLog;
    }

    async getAll(): Promise<Audit[]> {
        const audits = this.repository.manager
            .createQueryBuilder(Audit, 'audits')
            .leftJoinAndSelect('audits.executedBy', 'users')


        const resp = await audits.getMany();

        return resp;
    }

    getDecodedToken(token: string): Promise<any> {
        const decoded = this.jwtService.decode(token);
        return decoded;
    }
}
