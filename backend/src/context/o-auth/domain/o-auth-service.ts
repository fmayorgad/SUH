import { Payload } from '@models/payload.model';

export interface OAuthService {
  signJwt(payload: Payload): string;

  refreshJwt(token: string): Promise<string>;
}
