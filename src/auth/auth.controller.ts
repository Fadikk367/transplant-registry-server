import { Body, Req, Controller, HttpCode, Post, UseGuards, Get } from '@nestjs/common';

import { Public } from 'common/decorators';
import { CreateHospitalDto } from 'hospitals/create-hospital.dto';

import AuthService from './auth.service';
import RequestWithHospital from './AuthRequest';
import { LocalAuthGuard } from './guards/LocalAuthGuard';

 
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthService
  ) {}
 
  @Public()
  @Post('register')
  async register(@Body() createHospitalDto: CreateHospitalDto) {
    const hospital = await this.authService.registerHospital(createHospitalDto);
    const {accessToken} = await this.authService.login(hospital);

    return {
      accessToken,
      hospital,
    }
  }
 

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: RequestWithHospital) {
    const {accessToken} = await this.authService.login(req.hospital);
    return {
      accessToken,
      hospital: req.hospital,
    }
  }

  @Get('profile')
  async getHospitalProfile(@Req() req: RequestWithHospital) {
    return req.hospital;
  }
}