import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
  TypeORMError,
} from 'typeorm';

import { GlobalResponseError } from './global.response.error';

@Catch(TypeORMError)
class GlobalTypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    let code = 'SQL_EXCEPTION';
    const stack = exception.stack;

    Logger.error(message, stack, `${request.method} ${request.url}`);

    let status: HttpStatus;

    switch (exception.constructor) {
      case QueryFailedError:
        code = 'DUPLICATE_ENTRY_SQL_EXCEPTION';
        status = HttpStatus.CONFLICT;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}

export const globalTypeORMExceptionFilter = new GlobalTypeORMExceptionFilter();
