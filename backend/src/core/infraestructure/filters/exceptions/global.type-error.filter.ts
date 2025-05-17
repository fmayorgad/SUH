import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { GlobalResponseError } from './global.response.error';

@Catch(TypeError)
class GlobalTypeErrorFilter implements ExceptionFilter {
  catch(exception: TypeError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    const stack = exception.stack;
    const description = stack.split('\n');

    const code = 'TYPE_ERROR_EXCEPTION';

    Logger.error(message, stack, `${request.method} ${request.url}`);

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request, description));
  }
}

export const globalTypeErrorFilter = new GlobalTypeErrorFilter();
