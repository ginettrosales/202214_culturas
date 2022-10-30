import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { CiudadRestauranteController } from './ciudad-restaurante.controller';
import { CiudadRestauranteResolver } from './ciudad-restaurante.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, RestauranteEntity])],
  providers: [CiudadRestauranteService, CiudadRestauranteResolver],
  controllers: [CiudadRestauranteController]
})
export class CiudadRestauranteModule {}
