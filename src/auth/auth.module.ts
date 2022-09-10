import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { HospitalsModule } from 'hospitals/hospitals.module';

import AuthService from './auth.service';
import { AuthenticationController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { TypeOrmModule } from '@nestjs/typeorm';
import Hospital from 'hospitals/hospital.entity';
import { LocalStrategy } from './strategies/local.strategy';
 
@Module({
  imports: [
    HospitalsModule, 
    PassportModule, 
    ConfigModule,
    TypeOrmModule.forFeature([Hospital]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}