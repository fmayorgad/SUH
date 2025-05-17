import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { GlobalResponseError } from './global.response.error';

@Catch(HttpException)
class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const stack = exception.stack;
    const description: string | object =
      typeof exception.getResponse() === 'string'
        ? exception.getResponse()
        : exception.getResponse()['message'];

    const code = 'HTTP_EXCEPTION';

    Logger.error(message, stack, `${request.method} ${request.url}`);

    response
      .status(status)
      .json(GlobalResponseError(status, message, code, request, description));
  }
}

export const globalHttpExceptionFilter = new GlobalHttpExceptionFilter();
