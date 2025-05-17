import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

interface Environment {
  protocol?: string;
  server?: string;
  port?: string;
  version?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeneralUtilities {
  constructor() {}

  createMainUrl(params: Environment): string {
    const { protocol, server, port, defaultVersion } = environment.ivc;

    return `${params.protocol || protocol}//${params.server || server}:${
      params.port || port
    }/v${params.version || defaultVersion}`;
  }
}
