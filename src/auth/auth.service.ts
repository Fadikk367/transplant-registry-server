import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { CreateHospitalDto } from 'hospitals/create-hospital.dto';
import Hospital from 'hospitals/hospital.entity';
import { PostgresErrorCode } from 'database/PostgresErrorCode';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import CredentialsDto from './credentials.dto';

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  
  async registerHospital(createHospitalDto: CreateHospitalDto) {
    try {
      const hashedPassword = await bcrypt.hash(createHospitalDto.password, 10);
      const hospital = this.hospitalsRepository.create({...createHospitalDto, password: hashedPassword});
      await this.hospitalsRepository.save(hospital);
  
      return hospital;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Hospital with given login already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(hospital: Hospital) {
    const payload = { id: hospital.id, login: hospital.login };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getAuthenticatedHospital({login, password}: CredentialsDto) {
    const hospital = await this.hospitalsRepository.findOneBy({login});

    if (!hospital) {
      throw new HttpException(`Invalid login or password`, HttpStatus.NOT_FOUND);
    }

    await this.verifyPassword(password, hospital.password);

    return hospital;
  }

  private async verifyPassword(plain: string, hash: string) {
    const isValid = await bcrypt.compare(plain, hash);

    if (!isValid) {
      throw new HttpException(`Invalid login or password`, HttpStatus.NOT_FOUND);
    }
  }
}

export default AuthService;
