import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { OAuthService } from '../domain/o-auth-service';
import { Payload } from '@models/payload.model';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class PassportOAuthService implements OAuthService {
  constructor(private readonly jwtService: JwtService) {}

  signJwt(payload: Payload): string {
    return this.jwtService.sign(payload);
  }

  async refreshJwt(token: string): Promise<string> {
    try {
      await this.jwtService.verifyAsync(token);

      return this.getSignToken(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return this.getSignToken(token);
      } else {
        throw new UnauthorizedException(error.message);
      }
    }
  }

  private getSignToken(token: string): string {
    const payload: Payload = this.jwtService.decode(token) as Payload;

    delete payload['exp'];
    delete payload['iat'];

    return this.jwtService.sign(payload);
  }
}
