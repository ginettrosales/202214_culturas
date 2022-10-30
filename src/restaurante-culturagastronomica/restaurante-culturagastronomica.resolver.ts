import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';

@Resolver()
export class RestauranteCulturagastronomicaResolver {

    constructor(private restauranteCulturagastronomicaService: RestauranteCulturagastronomicaService) {}

    @Query(() => [CulturaGastronomicaEntity])
    findCulturasByRestauranteId(@Args('id_restaurante') id_restaurante: string): Promise<CulturaGastronomicaEntity[]> {
        return this.restauranteCulturagastronomicaService.findCulturasByRestauranteId(id_restaurante);
    }

    @Query(() => CulturaGastronomicaEntity)
    findculturaByRestauranteIdculturaId(@Args('id_restaurante') id_restaurante: string,@Args('id_cultura') id_cultura: string ): Promise<CulturaGastronomicaEntity> {
        return this.restauranteCulturagastronomicaService.findculturaByRestauranteIdculturaId(id_restaurante,id_cultura);
    }

    @Mutation(() => RestauranteEntity)
    addCulturaRestaurante(@Args('id_restaurante') id_restaurante: string,@Args('id_cultura') id_cultura: string): Promise<RestauranteEntity> {
       return this.restauranteCulturagastronomicaService.addCulturaRestaurante(id_restaurante, id_cultura);
   }

    @Mutation(() => RestauranteEntity)
    associateCulturasRestaurante(@Args({ name: 'culturas', type: () => [CulturaGastronomicaDto] }) culturasDto: CulturaGastronomicaDto[], @Args('id_restaurante') id_restaurante: string): Promise<RestauranteEntity> {
       const culturas = plainToInstance(CulturaGastronomicaEntity, culturasDto);
       return this.restauranteCulturagastronomicaService.associateCulturasRestaurante(id_restaurante, culturas);
   }

    @Mutation(() => String)
    deleteCulturaRestaurante(@Args('id_restaurante') id_restaurante: string, @Args('id_cultura') id_cultura: string) {
       this.restauranteCulturagastronomicaService.deleteCulturaRestaurante(id_restaurante, id_cultura);
       return id_cultura;
   }
}
