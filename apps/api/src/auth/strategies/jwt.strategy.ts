import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

// Custom extractor that tries to get the JWT from multiple sources
const fromAuthHeaderAsBearerTokenOrCookie = (req: Request) => {
  // Try to extract the token from the Authorization header
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  // If no token in the header, try to get it from cookies
  if (!token && req.cookies) {
    token = req.cookies['auth_token'];
  }

  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: fromAuthHeaderAsBearerTokenOrCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-dev-only',
    });
  }

  async validate(payload: any) {
    // Check if the payload has the expected structure
    if (!(payload.sub || payload.id) || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return { id: payload.sub || payload.id, email: payload.email };
  }
}
