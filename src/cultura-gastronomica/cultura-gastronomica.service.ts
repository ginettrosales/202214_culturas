import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors'
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaService {
    cacheKey: string = "culturas-gastronomicas";
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<CulturaGastronomicaEntity[]>{
        const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
        if(!cached){
           const culturas: CulturaGastronomicaEntity[] = await this.culturaGastronomicaRepository.find({relations: ["productos","recetas","paises"]});
           await this.cacheManager.set(this.cacheKey, culturas);
           return culturas;
       }
       return cached;
    }

    async findOne(id: string): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id}, relations: ["productos","recetas","paises"] } );
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND);
   
        return cultura;
    }

    async create(cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        return await this.culturaGastronomicaRepository.save(cultura);
    }

    async update(id: string, cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        const persistedCulturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!persistedCulturaGastronomica)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND);
        
        return await this.culturaGastronomicaRepository.save({...persistedCulturaGastronomica, ...cultura});
    }

    async delete(id: string) {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND);
     
        await this.culturaGastronomicaRepository.remove(cultura);
    }

}
