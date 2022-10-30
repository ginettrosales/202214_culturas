import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisCulturaGastronomicaService {
  
  cacheKey: string = "pais-culturas";

    constructor(
      @InjectRepository(PaisEntity)
      private readonly paisRepository: Repository<PaisEntity>,
        
      @InjectRepository(CulturaGastronomicaEntity)
      private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,

      @Inject(CACHE_MANAGER)
      private readonly cacheManager: Cache
    ) {}

    async addCulturaGastronomicaPais(paisId: string, culturaId: string): Promise<PaisEntity> {
      const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
      if (!cultura)
        throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND);
    
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}, relations: ["culturas", "ciudades"]})
      if (!pais)
        throw new BusinessLogicException("El pais con el identificador especificado no existe", BusinessError.NOT_FOUND);
  
      pais.culturas = [...pais.culturas, cultura];
      return await this.paisRepository.save(pais);
    }

    async findCulturaByPaisIdCulturaId(paisId: string, culturaId: string): Promise<CulturaGastronomicaEntity> {
      const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
      if (!cultura)
        throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
     
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}, relations: ["ciudades", "culturas"]});
      if (!pais)
        throw new BusinessLogicException("El pais con el identificador especificado no existe", BusinessError.NOT_FOUND)
 
      const paisCultura: CulturaGastronomicaEntity = pais.culturas.find(e => e.id === cultura.id);
 
      if (!paisCultura)
        throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no está asociada al país", BusinessError.PRECONDITION_FAILED)
 
      return paisCultura;
    }

    async findCulturasByPaisId(paisId: string): Promise<CulturaGastronomicaEntity[]> {
      const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      
        if(!cached){
          
          const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}, relations: ["ciudades", "culturas"]});
          if (!pais){
            throw new BusinessLogicException("El pais con el identificador especificado no existe", BusinessError.NOT_FOUND)
          }
          
          await this.cacheManager.set(this.cacheKey, pais.culturas);
          return pais.culturas;
        }
        
        return cached;
    }

    async associateCulturasPais(paisId: string, culturas: CulturaGastronomicaEntity[]): Promise<PaisEntity> {
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}, relations: ["ciudades", "culturas"]});
  
      if (!pais)
        throw new BusinessLogicException("El pais con el identificador especificado no existe", BusinessError.NOT_FOUND)
  
      for (let i = 0; i < culturas.length; i++) {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturas[i].id}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
      }
  
      pais.culturas = culturas;
      return await this.paisRepository.save(pais);
    }

    async deleteCulturaPais(paisId: string, culturaId: string){
      const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
      if (!cultura)
        throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
  
      const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}, relations: ["ciudades", "culturas"]});
      if (!pais)
        throw new BusinessLogicException("El pais con el identificador especificado no existe", BusinessError.NOT_FOUND)
  
      const paisCultura: CulturaGastronomicaEntity = pais.culturas.find(e => e.id === cultura.id);
  
      if (!paisCultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no está asociada al país", BusinessError.PRECONDITION_FAILED)

      pais.culturas = pais.culturas.filter(e => e.id !== culturaId);
      await this.paisRepository.save(pais);
    }
}