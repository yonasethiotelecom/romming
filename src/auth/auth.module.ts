import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule, JwtService } from '@nestjs/jwt';

import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { LdapStrategy } from './strategies/ldap-strategy';
import { UsersService } from '@/users/users.service';
import { LocalStrategy } from './strategies/local-strategy';
import { AbilityModule } from '@/ability/ability.module';

@Module({
  providers: [
    AuthService,
    LdapStrategy,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    UsersService,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions: { expiresIn: '600000000000000000000000s' },
    }),
    AbilityModule,
  ],
})
export class AuthModule {}
