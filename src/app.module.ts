import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { EstrellaMichellinModule } from './estrella_michellin/estrella_michellin.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { EstrellaMichellinEntity } from './estrella_michellin/estrella_michellin.entity';
import { RestauranteEstrellamichellinModule } from './restaurante-estrellamichellin/restaurante-estrellamichellin.module';
import { ProductoModule } from './producto/producto.module';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { RecetaModule } from './receta/receta.module';
import { ProductoEntity } from './producto/producto.entity';
import { CulturaGastronomicaEntity } from './cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from './receta/receta.entity';
import { CulturaGastronomicaProductoModule } from './cultura-gastronomica-producto/cultura-gastronomica-producto.module';
import { CulturaGastronomicaRecetaModule } from './cultura-gastronomica-receta/cultura-gastronomica-receta.module';
import { RestauranteCulturagastronomicaModule } from './restaurante-culturagastronomica/restaurante-culturagastronomica.module';
import { CulturagastronomicaRestauranteModule } from './culturagastronomica-restaurante/culturagastronomica-restaurante.module';
import { CiudadRestauranteModule } from './ciudad-restaurante/ciudad-restaurante.module';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { CiudadModule } from './ciudad/ciudad.module';
import { PaisEntity } from './pais/pais.entity';
import { PaisModule } from './pais/pais.module';
import { PaisCulturaGastronomicaModule } from './pais-cultura-gastronomica/pais-cultura-gastronomica.module';
import { PaisCiudadModule } from './pais-ciudad/pais-ciudad.module';
import { RecetaProductoModule } from './receta-producto/receta-producto.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import * as sqliteStore from 'cache-manager-sqlite';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [ProductoModule, CulturaGastronomicaModule, RecetaModule, CulturaGastronomicaProductoModule,CiudadModule,EstrellaMichellinModule,RestauranteModule,CulturagastronomicaRestauranteModule, RestauranteEstrellamichellinModule, RestauranteCulturagastronomicaModule,CiudadRestauranteModule, PaisModule, PaisCulturaGastronomicaModule, PaisCiudadModule, RecetaProductoModule, AuthModule, UserModule, CulturaGastronomicaRecetaModule,
   TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cultura_gastronomica',
      entities: [ProductoEntity, CulturaGastronomicaEntity, RecetaEntity, CiudadEntity, RestauranteEntity, EstrellaMichellinEntity, PaisEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      isGlobal: true,
      options: {
        ttl: 5
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
    RestauranteEstrellamichellinModule,
    CulturaGastronomicaModule,
    ProductoModule,
    RecetaModule,
    CulturaGastronomicaProductoModule,
    RestauranteCulturagastronomicaModule,
    CulturagastronomicaRestauranteModule,
    CiudadRestauranteModule,
    CiudadModule,
    RestauranteEstrellamichellinModule,
    CulturagastronomicaRestauranteModule,
    PaisModule,
    PaisCulturaGastronomicaModule,
    PaisCiudadModule,
    RecetaProductoModule,
    UserModule,
    AuthModule,
    EstrellaMichellinModule,
    RestauranteModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, UserService,
    {
      provide: APP_GUARD,
      useClass:RolesGuard,
    }],
})
export class AppModule {}