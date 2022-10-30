import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import {RecetaEntity } from '../receta/receta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaRecetaService {
    
  cacheKey: string = "culturagastronomicas_recetas";
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,
    
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async addRecetaToCulturaGastronomica(culturaId: string, recetaId: string): Promise<CulturaGastronomicaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND);
      
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]})
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND);
    
        cultura.recetas = [...cultura.recetas, receta];
        return await this.culturaRepository.save(cultura);
    }

    async findRecetaCulturaGastronomicaIdRecetaId(culturaId: string, recetaId: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND)
       
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.id === receta.id);
   
        if (!culturaReceta)
          throw new BusinessLogicException("La receta con el identificador especificado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
   
        return culturaReceta;
    }

    async findRecetasByCulturaGastronomicaId(culturaId: string): Promise<RecetaEntity[]> {
      
      const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
      
        if(!cached){
  
          const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
          if (!cultura)
              throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
          await this.cacheManager.set(this.cacheKey, cultura.recetas);
          return cultura.recetas;
        }
        return cached;
    }

    async associateRecetasCulturaGastronomica(recetaId: string, recetas: RecetaEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: recetaId}, relations: ["productos", "recetas"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < recetas.length; i++) {
          const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetas[i].id}});
          if (!receta)
            throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND)
        }
    
        cultura.recetas = recetas;
        return await this.culturaRepository.save(cultura);
      }

      async deleteRecetaCulturaGastronomica(culturaId: string, recetaId: string){
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}});
        if (!receta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.id === receta.id);
    
        if (!culturaReceta)
            throw new BusinessLogicException("La receta con el identificador especificado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.recetas = cultura.recetas.filter(e => e.id !== recetaId);
        await this.culturaRepository.save(cultura);
    }
}
