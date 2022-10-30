import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller';
import { CulturaGastronomicaResolver } from './cultura-gastronomica.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
  providers: [CulturaGastronomicaService, CulturaGastronomicaResolver],
  controllers: [CulturaGastronomicaController]
})
export class CulturaGastronomicaModule {}
