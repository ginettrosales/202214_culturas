import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaService } from './receta.service';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RecetaController { 
    
    constructor(private readonly recetaService: RecetaService) {}

    //Método findAll
    @Get()
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findAll() {
      return await this.recetaService.findAll();
    }

    //Método findOne
    @Get(':recetaId')
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findOne(@Param('recetaId') recetaId: string) {
        return await this.recetaService.findOne(recetaId);
    }

    @Post()
    @Roles(Role.ESCRITURA)
    async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
    }

    //Método update
    @Put(':recetaId')
    @Roles(Role.ESCRITURA)
    async update(@Param('recetaId') recetaId: string, @Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
    }

    //Método delete
    @Delete(':recetaId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
    async delete(@Param('recetaId') recetaId: string) {
        return await this.recetaService.delete(recetaId);
    }

}
