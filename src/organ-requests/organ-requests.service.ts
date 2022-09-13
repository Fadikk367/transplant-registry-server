import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Hospital from 'hospitals/hospital.entity';

import { Repository } from 'typeorm';

import CreateOrganRequestDto from './dto/create-organ-request.dto';
import FilterOrganRequestsDto from './dto/filter-organ-requests.dto';
import OrganRequest from './entities/organ-request.entity';


@Injectable()
export class OrganRequestsService {
  constructor(
    @InjectRepository(OrganRequest)
    private organRequestsRepository: Repository<OrganRequest>
  ) {}

  async create(createOrganRequestDto: CreateOrganRequestDto, hospital: Hospital) {
    const organRequest = this.organRequestsRepository.create(createOrganRequestDto);
    organRequest.hospital = hospital;
    await this.organRequestsRepository.save(organRequest);

    return organRequest;
  }

  findAll({hla, organ, priority}: FilterOrganRequestsDto) {
    const query = this.organRequestsRepository.createQueryBuilder('request');
  
    if (organ) {
      query.andWhere("request.organ = :organ", {organ});
    }

    if (hla) {
      query.andWhere("request.hla = :hla", {hla});
    }

    if (priority) {
      query.andWhere("request.priority = :priority", {priority});
    }

    return query.getMany();
  }

  findOne(id: number) {
    return this.organRequestsRepository.findOneBy({id});
  }

  async remove(id: number) {
    const result = await this.organRequestsRepository.delete({id});
    result.affected
    if (!result.affected) {
      throw new HttpException(`Organ with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }
  }
}
