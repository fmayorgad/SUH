import { Request } from 'express';
import { ResponseErrorInterface } from './response.error.interface';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  description?: string | object,
) => ResponseErrorInterface = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  description?: string | object,
): ResponseErrorInterface => {
  return {
    statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
    description,
  };
};
