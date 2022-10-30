import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
import { RestauranteCulturagastronomicaController } from './restaurante-culturagastronomica.controller';
import { RestauranteCulturagastronomicaResolver } from './restaurante-culturagastronomica.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity])],
  providers: [RestauranteCulturagastronomicaService, RestauranteCulturagastronomicaResolver],
  controllers: [RestauranteCulturagastronomicaController]
})
export class RestauranteCulturagastronomicaModule {}
