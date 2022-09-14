import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import Hospital from 'hospitals/hospital.entity';
import Organ from 'organs/entities/organ.entity';
import OrganRequest from 'organ-requests/entities/organ-request.entity';
import OrganMatch from 'organ-match/entities/organ-match.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        database: 'transplant-registry',
        entities: [Hospital, Organ, OrganRequest, OrganMatch],
        synchronize: true,
      })
    }),
  ],
})
export class DatabaseModule {}
