import { Module } from '@nestjs/common';
import { OrgansService } from './organs.service';
import { OrgansController } from './organs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Organ from './entities/organ.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organ])],
  controllers: [OrgansController],
  providers: [OrgansService]
})
export class OrgansModule {}
