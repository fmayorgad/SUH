import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PassportOAuthService } from './passport-o-auth.service';
import { JwtStrategy } from './jwt.strategy';

const OAuthServiceProvider = {
  provide: 'OAuthService',
  useClass: PassportOAuthService,
};

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: 'HS256',
      },
    }),
  ],
  providers: [JwtStrategy, OAuthServiceProvider],
  exports: [OAuthServiceProvider],
})
export class OAuthModule {}
