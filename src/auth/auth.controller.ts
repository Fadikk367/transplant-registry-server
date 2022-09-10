import { Body, Req, Controller, HttpCode, Post, UseGuards, Get } from '@nestjs/common';
import AuthService from './auth.service';
import RequestWithHospital from './AuthRequest';
import { CreateHospitalDto } from 'hospitals/create-hospital.dto';
import { Public } from 'common/decorators';
import { LocalAuthGuard } from './guards/LocalAuthGuard';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
 
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthService
  ) {}
 
  @Public()
  @Post('register')
  async register(@Body() createHospitalDto: CreateHospitalDto) {
    return this.authService.registerHospital(createHospitalDto);
  }
 

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Req() req: RequestWithHospital) {
    return this.authService.login(req.hospital);
  }

  @Get('profile')
  async getHospitalProfile(@Req() req: RequestWithHospital) {
    return req.hospital;
  }
}