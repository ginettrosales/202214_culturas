import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturagastronomicaRestauranteService {

  cacheKey: string = "culturas_restaurantes";
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}
 
    async addRestauranteCultura(culturaId: string, restauranteId: string): Promise<CulturaGastronomicaEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND);
      
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes", "productos", "recetas"]})
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND);
    
        cultura.restaurantes = [...cultura.restaurantes, restaurante];
        return await this.culturaRepository.save(cultura);
      }
    
    async findRestauranteByCulturaIdRestauranteId(culturaId: string, restauranteId: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
       
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const culturarestaurante: RestauranteEntity = cultura.restaurantes.find(e => e.id === restaurante.id);
   
        if (!culturarestaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no esta asociada con la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
   
        return culturarestaurante;
    }
    
    async findRestaurantesByCulturaId(culturaId: string): Promise<RestauranteEntity[]> {

        const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey);
      
        if(!cached){
  
          const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
          if (!cultura)
              throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
          await this.cacheManager.set(this.cacheKey, cultura.restaurantes);
          return cultura.restaurantes;
        }
        return cached;
    }
    
    async associateRestaurantesCultura(culturaId: string, restaurantes: RestauranteEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < restaurantes.length; i++) {
          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restaurantes[i].id}});
          if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
        }
    
        cultura.restaurantes = restaurantes;
        return await this.culturaRepository.save(cultura);
      }
    
    async deleteRestauranteCultura(culturaId: string, restauranteId: string){
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["restaurantes"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const culturarestaurante: RestauranteEntity = cultura.restaurantes.find(e => e.id === restaurante.id);
    
        if (!culturarestaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no esta asociada con la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.restaurantes = cultura.restaurantes.filter(e => e.id !== restauranteId);
        await this.culturaRepository.save(cultura);
    }  


}
