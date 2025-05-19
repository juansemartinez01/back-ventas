import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request }    from 'express';
import { ConfigService } from '@nestjs/config';

export function cookieExtractor(req: Request): string | null {
  // lee la cookie llamada 'jwt'
  return req?.cookies?.jwt ?? null;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload.sub, payload.usuario, payload.roles
    return { id: payload.sub, usuario: payload.usuario, roles: payload.roles };
  }
}