import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadRestauranteService } from './ciudad-restaurante.service';

@Resolver()
export class CiudadRestauranteResolver {

    constructor(private ciudadRestauranteService: CiudadRestauranteService) {}

    @Query(() => [RestauranteEntity])
    findRestaurantesByCiudadId(@Args('id_ciudad') id_ciudad: string): Promise<RestauranteEntity[]> {
        return this.ciudadRestauranteService.findRestaurantesByCiudadId(id_ciudad);
    }

    @Query(() => RestauranteEntity)
    findRestauranteByCiudadIdRestauranteId(@Args('id_ciudad') id_ciudad: string,@Args('id_restaurante') id_restaurante: string ): Promise<RestauranteEntity> {
        return this.ciudadRestauranteService.findRestauranteByCiudadIdRestauranteId(id_ciudad,id_restaurante);
    }

    @Mutation(() => CiudadEntity)
    addRestauranteCiudad(@Args('id_restaurante') id_restaurante: string,@Args('id_ciudad') id_ciudad: string): Promise<CiudadEntity> {
       return this.ciudadRestauranteService.addRestauranteCiudad(id_ciudad, id_restaurante);
   }

    @Mutation(() => CiudadEntity)
    associateRestaurantesCiudad(@Args({ name: 'restaurantes', type: () => [RestauranteDto] }) restaurantesDto: RestauranteDto[], @Args('id_cultura') id_cultura: string): Promise<CiudadEntity> {
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
       return this.ciudadRestauranteService.associateRestaurantesCiudad(id_cultura, restaurantes);
   }

    @Mutation(() => String)
    deleteRestauranteCiudad(@Args('id_ciudad') id_ciudad: string, @Args('id_restaurante') id_restaurante: string) {
       this.ciudadRestauranteService.deleteRestauranteCiudad(id_ciudad, id_restaurante);
       return id_ciudad;
   }
}
