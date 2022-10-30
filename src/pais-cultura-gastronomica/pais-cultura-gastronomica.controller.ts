import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/entities/role.enum';
import { Roles } from '../user/roles.decorator';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class PaisCulturaGastronomicaController {
    constructor(private readonly paisCulturaGastronomicaService: PaisCulturaGastronomicaService){}

    @Post(':paisId/culturas-gastronomicas/:culturaId')
    @Roles(Role.ESCRITURA)
    async addCulturaGastronomicaPais(@Param('paisId') paisId: string, @Param('culturaId') culturaId: string){
       return await this.paisCulturaGastronomicaService.addCulturaGastronomicaPais(paisId, culturaId);
    }
    
    @Get(':paisId/culturas-gastronomicas/:culturaId')
    @Roles(Role.LECTURA)
    async findCulturaByPaisIdCulturaId(@Param('paisId') paisId: string, @Param('culturaId')culturaId: string){
        return await this.paisCulturaGastronomicaService.findCulturaByPaisIdCulturaId(paisId,culturaId);
    }
    
    @Put(':paisId/culturas-gastronomicas')
    @Roles(Role.ESCRITURA)
    async associateCulturasPais(@Body() culturaDto: CulturaGastronomicaDto[], @Param('paisId') paisId: string){
        const culturas = plainToInstance(CulturaGastronomicaEntity, culturaDto)
        return await this.paisCulturaGastronomicaService.associateCulturasPais(paisId, culturas);
    }

    @Get(':paisId/culturas-gastronomicas')
    @Roles(Role.LECTURA)
    async findCulturasByPaisId(@Param('paisId') paisId: string){
        return await this.paisCulturaGastronomicaService.findCulturasByPaisId(paisId);
    }
    
    @Delete(':paisId/culturas-gastronomicas/:culturaId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
    async deleteCulturaPais(@Param('paisId') paisId: string, @Param('culturaId') culturaId: string){
        return await this.paisCulturaGastronomicaService.deleteCulturaPais(paisId, culturaId);
    }
}
