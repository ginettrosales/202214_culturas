import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaisCiudadService } from './pais-ciudad.service';
import { CiudadDto } from 'src/ciudad/ciudad.dto';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class PaisCiudadController {

    constructor(private readonly paisCiudadService: PaisCiudadService){}

    @Post(':paisId/ciudades/:ciudadId')
    @Roles(Role.ESCRITURA)
   async addCulturaRestaurante(@Param('paisId') paisId: string, @Param('ciudadId') ciudadId: string){
       return await this.paisCiudadService.addCiudadToPais(paisId, ciudadId);
   }

   @Get(':paisId/ciudades/:ciudadId')
   @Roles(Role.LECTURA)
   async findCulturaByRestauranteIdCulturaId(@Param('paisId') paisId: string, @Param('ciudadId') ciudadId: string){
       return await this.paisCiudadService.findCiudadByPaisIdCiudadId(paisId, ciudadId);
   }

   @Get(':paisId/ciudades')
   @Roles(Role.LECTURA)
   async findCulturasByRestauranteId(@Param('paisId') paisId: string){
       return await this.paisCiudadService.findCiudadesByPaisId(paisId);
   }

   @Put(':paisId/ciudades')
   @Roles(Role.ESCRITURA)
   async associateCuilturasRestaurante(@Body() ciudadesDto: CiudadDto[], @Param('paisId') paisId: string){
       const culturas = plainToInstance(CiudadEntity, ciudadesDto)
       return await this.paisCiudadService.associateCiudadesToPais(paisId, culturas);
   }

   @Delete(':paisId/ciudades/:ciudadId')
   @Roles(Role.BORRADO)
    @HttpCode(204)
   async deleteCulturaRestaurante(@Param('paisId') paisId: string, @Param('ciudadId') ciudadId: string){
       return await this.paisCiudadService.removeCiudadFromPais(paisId, ciudadId);
   }
}
