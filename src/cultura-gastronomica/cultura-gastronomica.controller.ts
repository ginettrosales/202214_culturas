import { Controller, Body, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/entities/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturaGastronomicaController {

    constructor(private readonly culturaGastronomicaService: CulturaGastronomicaService) {}
    @Get()
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findAll() {
      return await this.culturaGastronomicaService.findAll();
    }
  
    @Get(':culturaId')
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findOne(@Param('culturaId') culturaId: string) {
      return await this.culturaGastronomicaService.findOne(culturaId);
    }
  
    @Post()
    @Roles(Role.ESCRITURA)
    async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
      const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
      return await this.culturaGastronomicaService.create(cultura);
    }
  
    @Put(':culturaId')
    @Roles(Role.ESCRITURA)
    async update(@Param('culturaId') culturaId: string, @Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
      const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
      return await this.culturaGastronomicaService.update(culturaId, cultura);
    }
  
    @Delete(':culturaId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
    async delete(@Param('culturaId') culturaId: string) {
      return await this.culturaGastronomicaService.delete(culturaId);
    }
}
