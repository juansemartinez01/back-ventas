import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request }    from 'express';
import { ConfigService } from '@nestjs/config';

export function cookieExtractor(req: Request): string | null {
  // lee la cookie llamada 'jwt'
  return req?.cookies?.jwt ?? null;
}
// src/auth/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, usuario: payload.usuario, roles: payload.roles };
  }
}