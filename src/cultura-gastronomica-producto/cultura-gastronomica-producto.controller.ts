import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaProductoService } from '../cultura-gastronomica-producto/cultura-gastronomica-producto.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/entities/role.enum';

@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class CulturaGastronomicaProductoController {
    constructor(private readonly culturaGastronomicaProductoService: CulturaGastronomicaProductoService){}
    
    @Post(':culturaId/productos/:productoId')
    @Roles(Role.ESCRITURA)
    async addProductoToCulturaGastronomica(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
       return await this.culturaGastronomicaProductoService.addProductoToCulturaGastronomica(culturaId, productoId);
    }
    
    @Get(':culturaId/productos/:productoId')
    @Roles(Role.LECTURA)
    async findProductoCulturaGastronomicaIdProductoId(@Param('culturaId') culturaId: string, @Param('productoId')productoId: string){
        return await this.culturaGastronomicaProductoService.findProductoCulturaGastronomicaIdProductoId(culturaId,productoId);
    }
    
    @Put(':culturaId/productos')
    @Roles(Role.ESCRITURA)
    async associateProductosCulturaGastronomica(@Body() productosDto: ProductoDto[], @Param('culturaId') culturaId: string){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaGastronomicaProductoService.associateProductosCulturaGastronomica(culturaId, productos);
    }

    @Get(':culturaId/productos')
    @Roles(Role.LECTURA)
    async findProductosByCulturaGastronomicaId(@Param('culturaId') culturaId: string){
        return await this.culturaGastronomicaProductoService.findProductosByCulturaGastronomicaId(culturaId);
    }
    
    @Delete(':culturaId/productos/:productoId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
       async deleteProductoCulturaGastronomica(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
           return await this.culturaGastronomicaProductoService.deleteProductoCulturaGastronomica(culturaId, productoId);
       }
}
