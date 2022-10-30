import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  @Roles(Role.LECTURA)
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisId')
  @Roles(Role.LECTURA)
  async findOne(@Param('paisId') paisId: string) {
    return await this.paisService.findOne(paisId);
  }

  @Post()
  @Roles(Role.ESCRITURA)
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisId')
  @Roles(Role.ESCRITURA)
  async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @Delete(':paisId')
  @Roles(Role.BORRADO)
  @HttpCode(204)
  async delete(@Param('paisId') paisId: string) {
    return await this.paisService.delete(paisId);
  }
}
