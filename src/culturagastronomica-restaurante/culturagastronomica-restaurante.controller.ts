import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { RestauranteDto } from 'src/restaurante/restaurante.dto';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturagastronomicaRestauranteController {

    constructor(private readonly culturagastronomicaRestauranteService: CulturagastronomicaRestauranteService){}

    @Post(':culturaId/restaurantes/:restauranteId')
    @Roles(Role.ESCRITURA)
    async addRestauranteCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturagastronomicaRestauranteService.addRestauranteCultura(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes/:restauranteId')
    @Roles(Role.LECTURA)
   async findRestauranteByCulturaIdRestauranteId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturagastronomicaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
   }

   @Get(':culturaId/restaurantes')
   @Roles(Role.LECTURA)
   async findRestaurantesByCulturaId(@Param('culturaId') culturaId: string){
       return await this.culturagastronomicaRestauranteService.findRestaurantesByCulturaId(culturaId);
   }

   @Put(':culturaId/restaurantes')
   @Roles(Role.ESCRITURA)
   async associateRestaurantesCultura(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string){
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
       return await this.culturagastronomicaRestauranteService.associateRestaurantesCultura(culturaId, restaurantes);
   }

   @Delete(':culturaId/restaurantes/:restauranteId')
   @Roles(Role.BORRADO)
    @HttpCode(204)
   async deleteRestauranteCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.culturagastronomicaRestauranteService.deleteRestauranteCultura(culturaId, restauranteId);
   }
}
