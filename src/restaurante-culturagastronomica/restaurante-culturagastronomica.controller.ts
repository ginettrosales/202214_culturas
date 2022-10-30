import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from 'src/cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from 'src/cultura-gastronomica/cultura-gastronomica.entity';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RestauranteCulturagastronomicaController {
    constructor(private readonly restauranteCulturagastronomicaService: RestauranteCulturagastronomicaService){}

    @Post(':restauranteId/culturas-gastronomicas/:culturaId')
    @Roles(Role.ESCRITURA)
   async addCulturaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturagastronomicaService.addCulturaRestaurante(restauranteId, culturaId);
   }

   @Get(':restauranteId/culturas-gastronomicas/:culturaId')
   @Roles(Role.LECTURA)
   async findCulturaByRestauranteIdCulturaId(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturagastronomicaService.findculturaByRestauranteIdculturaId(restauranteId, culturaId);
   }

   @Get(':restauranteId/culturas-gastronomicas')
   @Roles(Role.LECTURA)
   async findCulturasByRestauranteId(@Param('restauranteId') restauranteId: string){
       return await this.restauranteCulturagastronomicaService.findCulturasByRestauranteId(restauranteId);
   }

   @Put(':restauranteId/culturas-gastronomicas')
   @Roles(Role.ESCRITURA)
   async associateCuilturasRestaurante(@Body() culturasDto: CulturaGastronomicaDto[], @Param('restauranteId') restauranteId: string){
       const culturas = plainToInstance(CulturaGastronomicaEntity, culturasDto)
       return await this.restauranteCulturagastronomicaService.associateCulturasRestaurante(restauranteId, culturas);
   }

   @Delete(':restauranteId/culturas-gastronomicas/:culturaId')
   @Roles(Role.BORRADO)
    @HttpCode(204)
   async deleteCulturaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturagastronomicaService.deleteCulturaRestaurante(restauranteId, culturaId);
   }
}
