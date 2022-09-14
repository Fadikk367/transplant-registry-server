import { Controller, Get, Body, Patch, Param, ParseIntPipe, Req } from '@nestjs/common';

import RequestWithHospital from 'auth/AuthRequest';

import UpdateOrganMatchDto from './dto/update-organ-match.dto';
import { OrganMatchService } from './organ-match.service';

@Controller('organ-matches')
export class OrganMatchController {
  constructor(private readonly organMatchService: OrganMatchService) {}

  @Get()
  findAll(@Req() req: RequestWithHospital) {
    return this.organMatchService.findAll(req.hospital.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrganMatchDto: UpdateOrganMatchDto) {
    return this.organMatchService.update(id, updateOrganMatchDto);
  }
}
