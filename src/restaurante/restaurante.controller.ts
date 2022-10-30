import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RestauranteController {

    constructor(private readonly restauranteService: RestauranteService) {}

    @Get()
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findAll() {
      return await this.restauranteService.findAll();
    }

    @Get(':restauranteId')
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findOne(@Param('restauranteId') restauranteId: string) {
      return await this.restauranteService.findOne(restauranteId);
    }

    @Post()
    @Roles(Role.ESCRITURA)
    async create(@Body() restauranteDto: RestauranteDto) {
      const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
      return await this.restauranteService.create(restaurante);
    }

    @Put(':restauranteId')
    @Roles(Role.ESCRITURA)
  async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteDto) {
    const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
    return await this.restauranteService.update(restauranteId, restaurante);
  }

  @Delete(':restauranteId')
  @Roles(Role.BORRADO)
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
