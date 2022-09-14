import { Module } from '@nestjs/common';
import { OrganMatchService } from './organ-match.service';
import { OrganMatchController } from './organ-match.controller';
import OrganMatch from './entities/organ-match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgansModule } from 'organs/organs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganMatch]),
    OrgansModule,
  ],
  controllers: [OrganMatchController],
  providers: [OrganMatchService],
})
export class OrganMatchModule {}
