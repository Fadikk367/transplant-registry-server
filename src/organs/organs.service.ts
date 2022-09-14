import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganRequestStatus, OrganStatus } from 'constants/enums';
import Hospital from 'hospitals/hospital.entity';
import OrganMatch from 'organ-match/entities/organ-match.entity';
import OrganRequest from 'organ-requests/entities/organ-request.entity';
import { OrganRequestsService } from 'organ-requests/organ-requests.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOrganDto } from './dto/create-organ.dto';
import OrganFiltersDto from './dto/filter-organ.dto';
import Organ from './entities/organ.entity';

@Injectable()
export class OrgansService {
  constructor(
    private readonly organRequestsService: OrganRequestsService,
    @InjectRepository(Organ)
    private organsRepository: Repository<Organ>,
    @InjectRepository(OrganMatch)
    private organMatchesRepository: Repository<OrganMatch>,
    private dataSource: DataSource,
  ) {}

  async create(createOrganDto: CreateOrganDto, hospital: Hospital) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organ = this.organsRepository.create(createOrganDto);
      organ.hospital = hospital;
      await queryRunner.manager.save(organ);
  
      // check for requests in stats 'WAITING', if present create Match with oldest request with highest priority
      const matchingOrganRequests = await this.organRequestsService.findAll({
        hla: organ.hla, 
        organ: organ.type, 
        status: OrganRequestStatus.Waiting,
      });

      const matchedRequest = matchingOrganRequests[0];
      if (matchedRequest) {
        const match = this.organMatchesRepository.create({organ, request: matchedRequest});
        matchedRequest.status = OrganRequestStatus.Matched;
        organ.status = OrganStatus.Matched;
        await Promise.all([
          queryRunner.manager.save(match),
          queryRunner.manager.save(organ),
          queryRunner.manager.save(matchedRequest),
        ]);
        console.log({match, organ, matchedRequest});
      }
  
      await queryRunner.commitTransaction();
      return organ;
    } catch (error) {
      console.log({error});
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({type, hla, status}: OrganFiltersDto) {
    const query = this.organsRepository.createQueryBuilder('organ')
      .leftJoinAndSelect('organ.hospital', 'hospital');
  
    if (type) {
      query.andWhere("organ.type = :type", {type});
    }

    if (hla) {
      query.andWhere("organ.hla = :hla", {hla});
    }

    if (status) {
      query.andWhere("organ.status = :status", {status});
    }

    const priorityByStatus = {
      [OrganStatus.Available]: 2,
      [OrganStatus.Matched]: 1,
      [OrganStatus.Taken]: 0,
    }

    const organs = await query.getMany();
    return organs.sort((a, b) => {
      return priorityByStatus[b.status] - priorityByStatus[a.status];
    });

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
