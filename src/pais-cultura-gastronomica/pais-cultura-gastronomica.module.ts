import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';
import { PaisCulturaGastronomicaController } from './pais-cultura-gastronomica.controller';
import { PaisCulturaGastronomicaResolver } from './pais-cultura-gastronomica.resolver';

@Module({
    providers: [PaisCulturaGastronomicaService, PaisCulturaGastronomicaResolver],
    imports: [TypeOrmModule.forFeature([PaisEntity, CulturaGastronomicaEntity])],
    controllers: [PaisCulturaGastronomicaController],
})
export class PaisCulturaGastronomicaModule {}
