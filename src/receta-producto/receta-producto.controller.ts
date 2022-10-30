import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaProductoService } from '../receta-producto/receta-producto.service';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('receta-producto')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class RecetaProductoController {
    
    constructor(private readonly recetaProductoService: RecetaProductoService){}

    @Post(':recetaId/productos/:productoId')
    @Roles(Role.ESCRITURA)
    async addRecetaToProducto(@Param('recetaId') recetaId: string, @Param('productoId') productoId: string){
       return await this.recetaProductoService.addProductoReceta(recetaId, productoId);

    }
    
    @Get(':recetaId/productos/:productoId')
    @Roles(Role.LECTURA)
    async findProductoByRecetaIdProductoId(@Param('recetaId') recetaId: string, @Param('productoId')productoId: string){
        return await this.recetaProductoService.findProductoByRecetaIdProductoId(recetaId,productoId);
    }

    @Get(':recetaId/productos')
    @Roles(Role.LECTURA)
    async findProductosByRecetaId(@Param('restauranteId') restauranteId: string){
        return await this.recetaProductoService.findProductosByRecetaId(restauranteId);
    }
    
    @Put(':recetaId/productos')
    @Roles(Role.ESCRITURA)
    async associateProductosReceta(@Body() productoDto: ProductoDto[], @Param('recetaId') recetaId: string){
        const producto = plainToInstance(ProductoEntity, productoDto)
        return await this.recetaProductoService.associateProductosReceta(recetaId, producto);
    }
    
    @Delete(':recetaId/productos/:productoId')
    @Roles(Role.BORRADO)
    @HttpCode(204)
       async deleteProductoReceta(@Param('recetaId') recetaId: string, @Param('productoId') productoId: string){
           return await this.recetaProductoService.deleteProductoReceta(recetaId, productoId);
       }
}
