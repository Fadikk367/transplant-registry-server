import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './create-hospital.dto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @Get()
  findAll() {
    return this.hospitalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalsService.findOne(id, true);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalsService.delete(id);
  }
}
