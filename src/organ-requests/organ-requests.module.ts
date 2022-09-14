import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganRequestsService } from './organ-requests.service';
import { OrganRequestsController } from './organ-requests.controller';
import OrganRequest from './entities/organ-request.entity';
import OrganMatch from 'organ-match/entities/organ-match.entity';
import { OrgansModule } from 'organs/organs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganRequest]), 
    TypeOrmModule.forFeature([OrganMatch]), 
    forwardRef(() => OrgansModule),
  ],
  controllers: [OrganRequestsController],
  providers: [OrganRequestsService],
  exports: [OrganRequestsService]
})
export class OrganRequestsModule {}
