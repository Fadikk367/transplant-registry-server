import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Hospital from 'hospitals/hospital.entity';
import { Repository } from 'typeorm';
import { CreateOrganDto } from './dto/create-organ.dto';
import OrganFiltersDto from './dto/filter-organ.dto';
import Organ from './entities/organ.entity';

@Injectable()
export class OrgansService {
  constructor(
    @InjectRepository(Organ)
    private organsRepository: Repository<Organ>
  ) {}

  async create(createOrganDto: CreateOrganDto, hospital: Hospital) {
    const organ = this.organsRepository.create(createOrganDto);
    organ.hospital = hospital;
    await this.organsRepository.save(organ);

    return organ;
  }

  findAll({type, hla}: OrganFiltersDto) {
    const query = this.organsRepository.createQueryBuilder('organ');
  
    if (type) {
      query.andWhere("organ.type = :type", {type});
    }

    if (hla) {
      query.andWhere("organ.hla = :hla", {hla});
    }
    return query.getMany();
  }

  async findOne(id: number) {
    const organ = await this.organsRepository.findOne({where: {id}, relations: {hospital: true}});

    if (!organ) {
      throw new HttpException(`Organ with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }

    return organ;
  }

  async remove(id: number) {
    const result = await this.organsRepository.delete({id});
    result.affected
    if (!result.affected) {
      throw new HttpException(`Organ with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }
  }
}
