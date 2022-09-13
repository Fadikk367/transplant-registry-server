import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, Query } from '@nestjs/common';
import { OrgansService } from './organs.service';
import { CreateOrganDto } from './dto/create-organ.dto';
import AuthRequest from 'auth/AuthRequest';
import OrganFiltersDto from './dto/filter-organ.dto';

@Controller('organs')
export class OrgansController {
  constructor(private readonly organsService: OrgansService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() createOrganDto: CreateOrganDto) {
    return this.organsService.create(createOrganDto, req.hospital);
  }

  @Get()
  findAll(@Query() organFilters: OrganFiltersDto) {
    console.log({organFilters})
    return this.organsService.findAll(organFilters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organsService.remove(id);
  }
}
