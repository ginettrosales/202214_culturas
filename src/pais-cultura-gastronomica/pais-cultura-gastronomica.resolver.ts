import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from 'src/cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from 'src/cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from 'src/pais/pais.entity';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';

@Resolver()
export class PaisCulturaGastronomicaResolver {
    constructor(private paisCulturaGastronomicaService: PaisCulturaGastronomicaService) {}

    @Query(() => [CulturaGastronomicaEntity])
    findCulturasByPaisId(@Args('id_pais') id_pais: string): Promise<CulturaGastronomicaEntity[]> {
        return this.paisCulturaGastronomicaService.findCulturasByPaisId(id_pais);
    }

    @Query(() => CulturaGastronomicaEntity)
    findCulturaByPaisIdCulturaId(@Args('id_pais') id_pais: string,@Args('id_cultura') id_cultura: string ): Promise<CulturaGastronomicaEntity> {
        return this.paisCulturaGastronomicaService.findCulturaByPaisIdCulturaId(id_pais,id_cultura);
    }

    @Mutation(() => PaisEntity)
    addCulturaGastronomicaPais(@Args('id_pais') id_pais: string,@Args('id_cultura') id_cultura: string): Promise<PaisEntity> {
       return this.paisCulturaGastronomicaService.addCulturaGastronomicaPais(id_pais, id_cultura);
   }

    @Mutation(() => PaisEntity)
    associateCulturasPais(@Args({ name: 'culturas', type: () => [CulturaGastronomicaDto] }) culturaGastronomicaDto: CulturaGastronomicaDto[], @Args('id_pais') id_pais: string): Promise<PaisEntity> {
       const culturas = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
       return this.paisCulturaGastronomicaService.associateCulturasPais(id_pais, culturas);
   }

    @Mutation(() => String)
    deleteCulturaPais(@Args('id_pais') id_pais: string, @Args('id_cultura') id_cultura: string) {
       this.paisCulturaGastronomicaService.deleteCulturaPais(id_pais, id_cultura);
       return id_cultura;
   }
}
