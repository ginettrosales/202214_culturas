import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaProductoController } from '../cultura-gastronomica-producto/cultura-gastronomica-producto.controller';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { CulturaGastronomicaProductoResolver } from './cultura-gastronomica-producto.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity])],
    providers: [CulturaGastronomicaProductoService, CulturaGastronomicaProductoResolver],
    controllers: [CulturaGastronomicaProductoController],
})
export class CulturaGastronomicaProductoModule {}
