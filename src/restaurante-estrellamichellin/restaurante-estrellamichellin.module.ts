import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteEstrellamichellinService } from './restaurante-estrellamichellin.service';
import { RestauranteEstrellamichellinController } from './restaurante-estrellamichellin.controller';
import { RestauranteEstrellamichellinResolver } from './restaurante-estrellamichellin.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, EstrellaMichellinEntity])],
  providers: [RestauranteEstrellamichellinService, RestauranteEstrellamichellinResolver],
  controllers: [RestauranteEstrellamichellinController]
})
export class RestauranteEstrellamichellinModule {}
