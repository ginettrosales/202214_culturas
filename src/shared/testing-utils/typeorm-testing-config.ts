import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { EstrellaMichellinEntity } from '../../estrella_michellin/estrella_michellin.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';

import { CulturaGastronomicaEntity } from '../../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { PaisEntity } from '../../pais/pais.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [CulturaGastronomicaEntity, ProductoEntity, RecetaEntity, RestauranteEntity, EstrellaMichellinEntity, CiudadEntity, PaisEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([CulturaGastronomicaEntity, ProductoEntity, RecetaEntity, RestauranteEntity, EstrellaMichellinEntity, CiudadEntity, PaisEntity]),
];

