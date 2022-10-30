import { Module } from '@nestjs/common';
import { PaisCiudadService } from './pais-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisCiudadController } from './pais-ciudad.controller';
import { PaisCiudadResolver } from './pais-ciudad.resolver';

@Module({
  providers: [PaisCiudadService, PaisCiudadResolver],
  imports: [TypeOrmModule.forFeature([PaisEntity, CiudadEntity])],
  controllers: [PaisCiudadController],
})
export class PaisCiudadModule {}
