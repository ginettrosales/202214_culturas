import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { CiudadController } from './ciudad.controller';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadResolver } from './ciudad.resolver';

@Module({ 
    imports:[TypeOrmModule.forFeature([CiudadEntity])], 
    providers: [CiudadService, CiudadResolver], 
    controllers: [CiudadController]
})
export class CiudadModule {}
