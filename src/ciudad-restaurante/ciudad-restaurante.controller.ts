import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { RestauranteDto } from 'src/restaurante/restaurante.dto';
import { RestauranteEntity } from 'src/restaurante/restaurante.entity';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CiudadRestauranteController {

    constructor(private readonly ciudadRestauranteService: CiudadRestauranteService){}

    @Post(':culturaId/restaurantes/:restauranteId')
    @Roles(Role.ESCRITURA)
    async addRestauranteCiudad(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.ciudadRestauranteService.addRestauranteCiudad(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes/:restauranteId')
    @Roles(Role.LECTURA)
   async findRestauranteByCiudadIdRestauranteId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.ciudadRestauranteService.findRestauranteByCiudadIdRestauranteId(culturaId, restauranteId);
   }

   @Get(':culturaId/restaurantes')
   @Roles(Role.LECTURA)
   async findRestaurantesByCiudadId(@Param('culturaId') culturaId: string){
       return await this.ciudadRestauranteService.findRestaurantesByCiudadId(culturaId);
   }

   @Put(':culturaId/restaurantes')
   @Roles(Role.ESCRITURA)
   async associateRestaurantesCiudad(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string){
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
       return await this.ciudadRestauranteService.associateRestaurantesCiudad(culturaId, restaurantes);
   }

   @Delete(':culturaId/restaurantes/:restauranteId')
   @Roles(Role.BORRADO)
@HttpCode(204)
   async deleteRestauranteCiudad(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
       return await this.ciudadRestauranteService.deleteRestauranteCiudad(culturaId, restauranteId);
   }

}
