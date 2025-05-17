import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { GlobalResponseError } from './global.response.error';

import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

@Catch(JsonWebTokenError)
class GlobalJsonWebTokenExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    let code = 'JSON_WEB_TOKEN_EXCEPTION';
    const stack = exception.stack;

    // Logger.error(message, stack, `${request.method} ${request.url}`);

    let status: HttpStatus;

    switch (exception.constructor) {
      case TokenExpiredError:
        status = HttpStatus.FORBIDDEN;
        code = 'JSON_WEB_TOKEN_EXPIRED';
        break;
      case NotBeforeError:
        status = HttpStatus.UNAUTHORIZED;
        break;
      default:
        status = HttpStatus.FORBIDDEN;
    }

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request));
  }
}

export const globalJsonWebTokenExceptionFilter =
  new GlobalJsonWebTokenExceptionFilter();
