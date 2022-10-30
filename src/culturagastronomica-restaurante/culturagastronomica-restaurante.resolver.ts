import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';

@Resolver()
export class CulturagastronomicaRestauranteResolver {

    constructor(private culturagastronomicaRestauranteService: CulturagastronomicaRestauranteService) {}

    @Query(() => [RestauranteEntity])
    findRestaurantesByCulturaId(@Args('id_cultura') id_cultura: string): Promise<RestauranteEntity[]> {
        return this.culturagastronomicaRestauranteService.findRestaurantesByCulturaId(id_cultura);
    }

    @Query(() => RestauranteEntity)
    findRestauranteByCulturaIdRestauranteId(@Args('id_cultura') id_cultura: string,@Args('id_restaurante') id_restaurante: string ): Promise<RestauranteEntity> {
        return this.culturagastronomicaRestauranteService.findRestauranteByCulturaIdRestauranteId(id_cultura,id_restaurante);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    addRestauranteCultura(@Args('id_restaurante') id_restaurante: string,@Args('id_cultura') id_cultura: string): Promise<CulturaGastronomicaEntity> {
       return this.culturagastronomicaRestauranteService.addRestauranteCultura(id_cultura, id_restaurante);
   }

    @Mutation(() => CulturaGastronomicaEntity)
    associateRestaurantesCultura(@Args({ name: 'restaurantes', type: () => [RestauranteDto] }) restaurantesDto: RestauranteDto[], @Args('id_cultura') id_cultura: string): Promise<CulturaGastronomicaEntity> {
       const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
       return this.culturagastronomicaRestauranteService.associateRestaurantesCultura(id_cultura, restaurantes);
   }

    @Mutation(() => String)
    deleteRestauranteCultura(@Args('id_cultura') id_cultura: string, @Args('id_restaurante') id_restaurante: string) {
       this.culturagastronomicaRestauranteService.deleteRestauranteCultura(id_cultura, id_restaurante);
       return id_cultura;
   }
}
