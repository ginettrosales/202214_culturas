import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from 'src/ciudad/ciudad.dto';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { PaisEntity } from 'src/pais/pais.entity';
import { PaisCiudadService } from './pais-ciudad.service';

@Resolver()
export class PaisCiudadResolver {

    constructor(private paisCiudadService: PaisCiudadService) {}

    @Query(() => [CiudadEntity])
    findCiudadesByPaisId(@Args('id_pais') id_restaurante: string): Promise<CiudadEntity[]> {
        return this.paisCiudadService.findCiudadesByPaisId(id_restaurante);
    }

    @Query(() => CiudadEntity)
    findCiudadByPaisIdCiudadId(@Args('id_pais') id_restaurante: string,@Args('id_ciudad') id_cultura: string ): Promise<CiudadEntity> {
        return this.paisCiudadService.findCiudadByPaisIdCiudadId(id_restaurante,id_cultura);
    }

    @Mutation(() => PaisEntity)
    addCiudadToPais(@Args('id_pais') id_restaurante: string,@Args('id_ciudad') id_cultura: string): Promise<PaisEntity> {
       return this.paisCiudadService.addCiudadToPais(id_restaurante, id_cultura);
   }

    @Mutation(() => PaisEntity)
    associateCiudadesToPais(@Args({ name: 'culturas', type: () => [CiudadDto] }) culturasDto: CiudadDto[], @Args('id_pais') id_restaurante: string): Promise<PaisEntity> {
       const ciudades = plainToInstance(CiudadEntity, culturasDto);
       return this.paisCiudadService.associateCiudadesToPais(id_restaurante, ciudades);
   }

    @Mutation(() => String)
    removeCiudadFromPais(@Args('id_pais') id_restaurante: string, @Args('id_ciudad') id_ciudad: string) {
       this.paisCiudadService.removeCiudadFromPais(id_restaurante, id_ciudad);
       return id_ciudad;
   }
}
