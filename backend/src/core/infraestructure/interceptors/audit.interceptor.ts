import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Audit } from '@models/audit.model';
import { AuditService } from '@services/audit.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private readonly createAudit: AuditService,
        private readonly reflector: Reflector,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request: Request = context.switchToHttp().getRequest();

        console.log("creando auditoria")
        const token = request.rawHeaders.find((header) => header.includes('Bearer'))?.split(' ')[1];

        console.log('Params :>> ', request.params);

        if (!token) {
            console.error("AuditInterceptor: Bearer token not found.");
        }

        const payload = token ? await this.createAudit.getDecodedToken(token) : null;

        const log = new Audit();
        const metadata = this.reflector.getAllAndOverride('AUDIT', [context.getClass(), context.getHandler()]);
        log.date = new Date();
        log.executes = `${request.route.path} ${request.params ? JSON.stringify(request.params) : ''}`;

        let requestData: any = null;
        let multi: any = null;

        if (request.is('multipart/form-data')) {
            // For multipart/form-data, req.body should contain the non-file fields
            // if middleware like Multer (configured for fields) has run.
            // We will only capture the body, excluding file information.
            multi = { ...request.body }; // Capture only non-file form fields
            console.log('Multipart Form Fields (multi):>> ', multi); // Log only form fields
            requestData = multi; // Assign form fields data to requestData
        } else if (request.body && Object.keys(request.body).length > 0) {
            requestData = request.body;
        }

        log.payload = requestData ? JSON.stringify(requestData).slice(0, 9990) : null;
        log.executedBy = payload ? { id: payload.sub } : { id: 'unknown' };
        log.action = metadata;

        console.log('log:>> ', log);


        return next
            .handle()
            .pipe(
                tap(async () => {
                    console.log('log i:>> ', log);
                    if (log.executedBy && log.action) {
                         const statusCode = context.switchToHttp().getResponse().statusCode;
                         if ([200, 201, 203, 204].includes(statusCode)) {
                            console.log('log i and status code:>> ', log, statusCode);
                            await this.createAudit.execute(log);
                         }
                    }
                },
                ));
    }
}