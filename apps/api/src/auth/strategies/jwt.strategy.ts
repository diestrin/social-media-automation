import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-dev-only',
    });
  }

  async validate(payload: any) {
    if (!payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return { id: payload.id, email: payload.email };
  }
}
