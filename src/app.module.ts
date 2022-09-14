import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'auth/auth.module';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { OrgansModule } from './organs/organs.module';
import { OrganRequestsModule } from './organ-requests/organ-requests.module';
import { OrganMatchModule } from './organ-match/organ-match.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    DatabaseModule, 
    AuthenticationModule, 
    HospitalsModule, 
    OrgansModule, 
    OrganRequestsModule, 
    OrganMatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
