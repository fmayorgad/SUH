import { Inject, Injectable } from '@nestjs/common';

import { OAuthService } from '@context/o-auth/domain/o-auth-service';

@Injectable()
export class RefreshToken {
  constructor(@Inject('OAuthService') private readonly service: OAuthService) {}

  execute(token: string): Promise<string> {
    return this.service.refreshJwt(token);
  }
}
