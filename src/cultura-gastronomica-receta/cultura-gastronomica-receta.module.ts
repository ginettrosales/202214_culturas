import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { CulturaGastronomicaRecetaController } from './cultura-gastronomica-receta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
  providers: [CulturaGastronomicaRecetaService],
  controllers: [CulturaGastronomicaRecetaController]
})
export class CulturaGastronomicaRecetaModule {}
