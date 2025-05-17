import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditSchema } from '@schemas/audit.schema';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditSchema]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256',
      },
    }),
  ],
  providers: [AuditService],
  exports: [AuditService],
})
export class CoreModule {} 