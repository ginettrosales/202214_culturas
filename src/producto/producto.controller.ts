import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/entities/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    @Get()
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async findAll() {
      return await this.productoService.findAll();
    }
  
    @Get(':productoId')
    async findOne(@Param('productoId') productoId: string) {
      return await this.productoService.findOne(productoId);
    }
  
    @Post()
    @Roles(Role.LECTURA, Role.SOLOLECTURA)
    async create(@Body() productoDto: ProductoDto) {
      const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
      return await this.productoService.create(producto);
    }
  
    @Put(':productoId')
    @Roles(Role.ESCRITURA)
    async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoDto) {
      const producto: ProductoEntity = plainToInstance(ProductoEntity, ProductoDto);
      return await this.productoService.update(productoId, producto);
    }
  
    @Delete(':productoId')
    @HttpCode(204)
    @Roles(Role.BORRADO)
    async delete(@Param('productoId') productoId: string) {
      return await this.productoService.delete(productoId);
    }
}
