import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USM_DATABASE_CONFIG } from './database.config';

@Module({
  imports: [TypeOrmModule.forRoot(USM_DATABASE_CONFIG)],
})
export class DatabaseModule {}
