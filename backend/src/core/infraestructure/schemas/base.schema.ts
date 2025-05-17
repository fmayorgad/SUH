import type { EntitySchemaColumnOptions } from "typeorm";

export const BaseSchema = {
  id: {
    type: 'uuid',
    generated: 'uuid',
    primary: true,
    unique: true,
  } as EntitySchemaColumnOptions,
  createdAt: {
    name: 'created_at',
    type: 'timestamp',
    createDate: true,
    select: false,
    default: () => 'CURRENT_TIMESTAMP'
  } as EntitySchemaColumnOptions,
  updatedAt: {
    name: 'updated_at',
    type: 'timestamp',
    updateDate: true,
    select: false,
    default: () => 'CURRENT_TIMESTAMP'
  } as EntitySchemaColumnOptions,
  deletedAt: {
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    deleteDate: true,
    select: false,
  } as EntitySchemaColumnOptions,
};