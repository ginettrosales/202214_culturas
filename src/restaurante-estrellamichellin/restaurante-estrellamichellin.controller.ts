import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteEstrellamichellinService } from './restaurante-estrellamichellin.service';
import { plainToInstance } from 'class-transformer';
import { EstrellaMichellinDto } from '../estrella_michellin/estrella-michellin.dto';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RestauranteEstrellamichellinController {
    constructor(private readonly restauranteEstrellamichellinService: RestauranteEstrellamichellinService){}

   @Post(':restauranteId/estrellasmichellin')
   @Roles(Role.ESCRITURA)
   async addEstrellaRestaurante(@Param('restauranteId') restauranteId: string, @Body() estrellaDto: EstrellaMichellinDto){
        const estrella: EstrellaMichellinEntity = plainToInstance(EstrellaMichellinEntity, estrellaDto);
       return await this.restauranteEstrellamichellinService.addEstrellaRestaurante(restauranteId, estrella);
   }

   @Get(':restauranteId/estrellasmichellin/:estrellaId')
   @Roles(Role.LECTURA)
   async findEstrellaByRestauranteIdEstrellaId(@Param('restauranteId') restauranteId: string, @Param('estrellaId') estrellaId: string){
       return await this.restauranteEstrellamichellinService.findEstrellaByRestauranteIdEstrellaId(restauranteId, estrellaId);
   }

   @Get(':restauranteId/estrellasmichellin')
   @Roles(Role.LECTURA)
   async findEstrellasByRestauranteId(@Param('restauranteId') restauranteId: string){
       return await this.restauranteEstrellamichellinService.findEstrellasByRestauranteId(restauranteId);
   }

   @Put(':restauranteId/estrellasmichellin')
   @Roles(Role.ESCRITURA)
   async associateEstrellasRestaurante(@Body() estrellasDto: EstrellaMichellinDto[], @Param('restauranteId') restauranteId: string){
       const estrellas = plainToInstance(EstrellaMichellinEntity, estrellasDto)
       return await this.restauranteEstrellamichellinService.associateEstrellasRestaurante(restauranteId, estrellas);
   }

   @Delete(':restauranteId/estrellasmichellin/:estrellaId')
   @Roles(Role.BORRADO)
   @HttpCode(204)
   async deleteEstrellaRestaurante(@Param('restauranteId') restauranteId: string, @Param('estrellaId') estrellaId: string){
       return await this.restauranteEstrellamichellinService.deleteEstrellaRestaurante(restauranteId, estrellaId);
   }
}
