import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganRequestStatus, OrganStatus } from 'constants/enums';
import Hospital from 'hospitals/hospital.entity';
import OrganMatch from 'organ-match/entities/organ-match.entity';
import { OrgansService } from 'organs/organs.service';

import { DataSource, Repository } from 'typeorm';

import CreateOrganRequestDto from './dto/create-organ-request.dto';
import FilterOrganRequestsDto from './dto/filter-organ-requests.dto';
import OrganRequest from './entities/organ-request.entity';


@Injectable()
export class OrganRequestsService {
  constructor(
    @Inject(forwardRef(() => OrgansService))
    private readonly organsService: OrgansService,
    @InjectRepository(OrganMatch)
    private organMatchesRepository: Repository<OrganMatch>,
    @InjectRepository(OrganRequest)
    private organRequestsRepository: Repository<OrganRequest>,
    private dataSource: DataSource,
  ) {}

  async create(createOrganRequestDto: CreateOrganRequestDto, hospital: Hospital) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organRequest = this.organRequestsRepository.create(createOrganRequestDto);
      organRequest.hospital = hospital;
      await queryRunner.manager.save(organRequest);
  
      // check for requests in stats 'WAITING', if present create Match with oldest request with highest priority
      const matchingOrgans = await this.organsService.findAll({
        hla: organRequest.hla, 
        type: organRequest.organ, 
        status: OrganStatus.Available,
      });

      const matchedOrgan = matchingOrgans[0];
      if (matchedOrgan) {
        const match = this.organMatchesRepository.create({organ: matchedOrgan, request: organRequest});
        matchedOrgan.status = OrganStatus.Matched;
        organRequest.status = OrganRequestStatus.Matched;
        await Promise.all([
          queryRunner.manager.save(match),
          queryRunner.manager.save(organRequest),
          queryRunner.manager.save(matchedOrgan),
        ]);
        console.log({match, organRequest, matchedOrgan});
      }
  
      await queryRunner.commitTransaction();
      return organRequest;
    } catch (error) {
      console.log({error});
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({hla, organ, status, priority}: FilterOrganRequestsDto) {
    const query = this.organRequestsRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.hospital', 'hospital');
  
    if (organ) {
      query.andWhere("request.organ = :organ", {organ});
    }

    if (hla) {
      query.andWhere("request.hla = :hla", {hla});
    }

    if (status) {
      query.andWhere("request.status = :status", {status});
    }

    if (priority) {
      query.andWhere("request.priority = :priority", {priority});
    }

    const requests = await query.getMany();
    return requests.sort((a, b) => b.priority - a.priority);
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
