import { Module } from '@nestjs/common';
import { OrgansService } from './organs.service';
import { OrgansController } from './organs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Organ from './entities/organ.entity';
import { OrganRequestsModule } from 'organ-requests/organ-requests.module';
import OrganRequest from 'organ-requests/entities/organ-request.entity';
import OrganMatch from 'organ-match/entities/organ-match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organ]),
    TypeOrmModule.forFeature([OrganMatch]), 
    OrganRequestsModule
  ],
  controllers: [OrgansController],
  providers: [OrgansService],
  exports: [OrgansService],
})
export class OrgansModule {}
