import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { HospitalsService } from 'hospitals/hospitals.service';

 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, 
    private readonly hospitalService: HospitalsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const hospital = await this.hospitalService.findOne(payload.id, false)
    return hospital;
  }
}