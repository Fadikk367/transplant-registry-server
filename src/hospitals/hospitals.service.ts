import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateHospitalDto } from './create-hospital.dto';
import Hospital from './hospital.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>
  ) {}
  
  async create(createHospitalDto: CreateHospitalDto) {
    const hospital = this.hospitalsRepository.create(createHospitalDto);
    await this.hospitalsRepository.save(hospital);
    return hospital;
  }

  findAll() {
    return this.hospitalsRepository.find();
  }

  async findOne(id: number) {
    const hospital = await this.hospitalsRepository.findOneBy({id});

    if (!hospital) {
      throw new HttpException(`Hospital with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }

    return hospital;
  }

  async delete(id: number) {
    const result = await this.hospitalsRepository.delete({id});
    result.affected
    if (!result.affected) {
      throw new HttpException(`Hospital with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }
  }
}
