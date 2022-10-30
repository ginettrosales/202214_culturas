import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaProductoService } from './receta-producto.service';
import { RecetaProductoController } from './receta-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, RecetaEntity])],
  providers: [RecetaProductoService],
  controllers: [RecetaProductoController]
})
export class RecetaProductoModule {}
