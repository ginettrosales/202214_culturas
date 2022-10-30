import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  @Roles(Role.LECTURA)
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':ciudadId')
  @Roles(Role.LECTURA)
  async findOne(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.findOne(ciudadId);
  }

  @Post()
  @Roles(Role.ESCRITURA)
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @Put(':ciudadId')
  @Roles(Role.ESCRITURA)
  async update(
    @Param('ciudadId') ciudadId: string,
    @Body() ciudadDto: CiudadDto,
  ) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  @Delete(':ciudadId')
  @Roles(Role.BORRADO)
  @HttpCode(204)
  async delete(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.delete(ciudadId);
  }
}
