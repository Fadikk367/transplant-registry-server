import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query, Req } from '@nestjs/common';

import AuthRequest from 'auth/AuthRequest';

import { OrganRequestsService } from './organ-requests.service';
import CreateOrganRequestDto from './dto/create-organ-request.dto';
import FilterOrganRequestsDto from './dto/filter-organ-requests.dto';


@Controller('organ-requests')
export class OrganRequestsController {
  constructor(private readonly organRequestsService: OrganRequestsService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() createOrganRequestDto: CreateOrganRequestDto) {
    return this.organRequestsService.create(createOrganRequestDto, req.hospital);
  }

  @Get()
  findAll(@Query() filters: FilterOrganRequestsDto) {
    return this.organRequestsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organRequestsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organRequestsService.remove(id);
  }
}
