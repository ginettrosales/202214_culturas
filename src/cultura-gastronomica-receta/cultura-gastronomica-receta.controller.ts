import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecetaDto } from '../receta/receta.dto';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRecetaService } from '../cultura-gastronomica-receta/cultura-gastronomica-receta.service';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cultura-gastronomica-receta')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturaGastronomicaRecetaController {
   
    constructor(private readonly culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService){}

    @Post(':culturaId/recetas/:recetaId')
    @Roles(Role.ESCRITURA)
    async addRecetaToCulturaGastronomica(@Param('culturaId') culturaId: string, @Param('recetaId') recetaId: string){
       return await this.culturaGastronomicaRecetaService.addRecetaToCulturaGastronomica(culturaId, recetaId);
    }
    
    @Get(':culturaId/recetas/:recetaId')
    @Roles(Role.LECTURA)
    async findRecetaCulturaGastronomicaIdRecetaId(@Param('culturaId') culturaId: string, @Param('recetaId')recetaId: string){
        return await this.culturaGastronomicaRecetaService.findRecetaCulturaGastronomicaIdRecetaId(culturaId,recetaId);
    }
    
    @Put(':culturaId/recetas')
    @Roles(Role.ESCRITURA)
    async associateRecetasCulturaGastronomica(@Body() recetasDto: RecetaDto[], @Param('culturaId') culturaId: string){
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return await this.culturaGastronomicaRecetaService.associateRecetasCulturaGastronomica(culturaId, recetas);
    }
    
    @Delete(':culturaId/recetas/:recetaId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
       async deleteRecetaCulturaGastronomica(@Param('culturaId') culturaId: string, @Param('recetaId') recetaId: string){
           return await this.culturaGastronomicaRecetaService.deleteRecetaCulturaGastronomica(culturaId, recetaId);
       }
}
