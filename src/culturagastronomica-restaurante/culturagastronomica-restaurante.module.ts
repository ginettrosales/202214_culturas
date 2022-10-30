import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { CulturagastronomicaRestauranteController } from './culturagastronomica-restaurante.controller';
import { CulturagastronomicaRestauranteResolver } from './culturagastronomica-restaurante.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity])],
  providers: [CulturagastronomicaRestauranteService, CulturagastronomicaRestauranteResolver],
  controllers: [CulturagastronomicaRestauranteController]
})
export class CulturagastronomicaRestauranteModule {}
