import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganMatchStatus, OrganRequestStatus, OrganStatus } from 'constants/enums';
import { OrgansService } from 'organs/organs.service';
import { DataSource, Repository } from 'typeorm';

import UpdateOrganMatchDto from './dto/update-organ-match.dto';
import OrganMatch from './entities/organ-match.entity';

@Injectable()
export class OrganMatchService {
  constructor(
    @InjectRepository(OrganMatch)
    private organMatchesRepository: Repository<OrganMatch>, 
    // @Inject(forwardRef(() => OrgansService))
    private readonly organsService: OrgansService,   
    private dataSource: DataSource,
  ) {}

  async findAll(hospitalId: number) {
    const matches = await this.organMatchesRepository.find({
      where: {request: {hospital: {id: hospitalId}}}, 
      relations: {organ: {hospital: true}, request: {hospital: true}},
    });

    return matches.sort((a, b) => Number(b.status === OrganMatchStatus.Pending) - Number(a.status === OrganMatchStatus.Pending))
  }


  async update(id: number, {status}: UpdateOrganMatchDto) {
    const organMatch = await this.organMatchesRepository.findOne({
      where: {id}, 
      relations: {organ: true, request: true}
    });

    if (!organMatch) {
      throw new HttpException(`Organ match with id= ${id} does not exist`, HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // If we reject a match - check if there is other organ that can be matched to this request
      // If yes, create new match object, release old organ to available status
      if (status === OrganMatchStatus.Rejected) {
        organMatch.status = OrganMatchStatus.Rejected;
        organMatch.organ.status = OrganStatus.Available;
        organMatch.request.status = OrganRequestStatus.Waiting;

        const matchingOrgans = await this.organsService.findAll({
          hla: organMatch.request.hla, 
          type: organMatch.request.organ, 
          status: OrganStatus.Available,
        });

        const matchedOrgan = matchingOrgans[0];
        if (matchedOrgan) {
          const newMatch = this.organMatchesRepository.create({organ: matchedOrgan, request: organMatch.request});
          matchedOrgan.status = OrganStatus.Matched;
          organMatch.request.status = OrganRequestStatus.Matched;
          await Promise.all([
            queryRunner.manager.save(newMatch),
            queryRunner.manager.save(matchedOrgan),
          ]);
        }

        await Promise.all([
          queryRunner.manager.save(organMatch),
          queryRunner.manager.save(organMatch.request),
        ]);
      // If we accept a match - change states:
      // - request to fulfilled
      // - organ to taken
      // - match to accpepted
      } else if (status === OrganMatchStatus.Accepted) {
        organMatch.status = OrganMatchStatus.Accepted;
        organMatch.request.status = OrganRequestStatus.Fulfilled;
        organMatch.organ.status = OrganStatus.Taken;

        await Promise.all([
          queryRunner.manager.save(organMatch),
          queryRunner.manager.save(organMatch.request),
          queryRunner.manager.save(organMatch.organ),
        ]);
      }
  
      await queryRunner.commitTransaction();
      return organMatch;
    } catch (error) {
      console.log({error});
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
