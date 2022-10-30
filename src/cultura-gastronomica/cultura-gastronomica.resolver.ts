import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Resolver()
export class CulturaGastronomicaResolver {
    constructor(private culturaService: CulturaGastronomicaService) {}

    @Query(() => [CulturaGastronomicaEntity])
    culturas(): Promise<CulturaGastronomicaEntity[]> {
        return this.culturaService.findAll();
    }
 
    @Query(() => CulturaGastronomicaEntity)
    cultura(@Args('id') id: string): Promise<CulturaGastronomicaEntity> {
        return this.culturaService.findOne(id);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    createCultura(@Args('cultura') culturaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return this.culturaService.create(cultura);
    }
 
    @Mutation(() => CulturaGastronomicaEntity)
    updateCultura(@Args('id') id: string, @Args('cultura') culturaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return this.culturaService.update(id, cultura);
    }
 
    @Mutation(() => String)
    deleteCultura(@Args('id') id: string) {
        this.culturaService.delete(id);
        return id;
    }
}
