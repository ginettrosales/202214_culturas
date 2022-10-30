import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Resolver()
export class CiudadResolver {

    constructor(private ciudadService:CiudadService) {}

    @Query(() => [CiudadEntity])
    ciudades(): Promise<CiudadEntity[]> {
        return this.ciudadService.findAll();
    }

    @Query(() => CiudadEntity)
    ciudad(@Args('id') id: string): Promise<CiudadEntity> {
        return this.ciudadService.findOne(id);
    }

    @Mutation(() => CiudadEntity)
    createCiudad(@Args('pais') PaisDto: CiudadDto): Promise<CiudadEntity> {
        const pais = plainToInstance(CiudadEntity, PaisDto);
        return this.ciudadService.create(pais);
    }
 
    @Mutation(() => CiudadEntity)
    updateCiudad(@Args('id') id: string, @Args('ciudad') PaisDto: CiudadDto): Promise<CiudadEntity> {
        const pais = plainToInstance(CiudadEntity, PaisDto);
        return this.ciudadService.update(id, pais);
    }
 
    @Mutation(() => String)
    deleteRestaurante(@Args('id') id: string) {
        this.ciudadService.delete(id);
        return id;
    }
}
