export interface ResponseErrorInterface {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
  description?: string | object;
}
