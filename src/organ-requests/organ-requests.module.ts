import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganRequestsService } from './organ-requests.service';
import { OrganRequestsController } from './organ-requests.controller';
import OrganRequest from './entities/organ-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganRequest])],
  controllers: [OrganRequestsController],
  providers: [OrganRequestsService]
})
export class OrganRequestsModule {}
