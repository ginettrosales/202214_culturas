import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { RestauranteEstrellamichellinService } from './restaurante-estrellamichellin.service';
import { plainToInstance } from 'class-transformer';
import { EstrellaMichellinDto } from '../estrella_michellin/estrella-michellin.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Resolver()
export class RestauranteEstrellamichellinResolver {

    constructor(private restauranteEstrellamichellinService: RestauranteEstrellamichellinService) {}

    @Query(() => [EstrellaMichellinEntity])
    findEstrellasByRestauranteId(@Args('id_restaurante') id_restaurante: string): Promise<EstrellaMichellinEntity[]> {
        return this.restauranteEstrellamichellinService.findEstrellasByRestauranteId(id_restaurante);
    }

    @Query(() => EstrellaMichellinEntity)
    findEstrellaByRestauranteIdEstrellaId(@Args('id_restaurante') id_restaurante: string,@Args('id_estrella') id_estrella: string ): Promise<EstrellaMichellinEntity> {
        return this.restauranteEstrellamichellinService.findEstrellaByRestauranteIdEstrellaId(id_restaurante,id_estrella);
    }

    @Mutation(() => RestauranteEntity)
    addEstrellaRestaurante(@Args('id_restaurante') id_restaurante: string,@Args('estrella') estrellaDto: EstrellaMichellinDto): Promise<RestauranteEntity> {
       const estrella = plainToInstance(EstrellaMichellinEntity, estrellaDto);
       return this.restauranteEstrellamichellinService.addEstrellaRestaurante(id_restaurante, estrella);
   }

    @Mutation(() => RestauranteEntity)
    associateEstrellasRestaurante(@Args({ name: 'estrellas', type: () => [EstrellaMichellinDto] }) esrellasDto: EstrellaMichellinDto[], @Args('id_restaurante') id_restaurante: string): Promise<RestauranteEntity> {
       const estrellas = plainToInstance(EstrellaMichellinEntity, esrellasDto);
       return this.restauranteEstrellamichellinService.associateEstrellasRestaurante(id_restaurante, estrellas);
   }

    @Mutation(() => String)
    deleteEstrellaRestaurante(@Args('id_restaurante') id_restaurante: string, @Args('id_estrella') id_estrella: string) {
       this.restauranteEstrellamichellinService.deleteEstrellaRestaurante(id_restaurante, id_estrella);
       return id_estrella;
   }

}
