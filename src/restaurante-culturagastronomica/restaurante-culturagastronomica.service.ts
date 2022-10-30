import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteCulturagastronomicaService {

  cacheKey: string = "restaurantes_culturas";
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async addCulturaRestaurante(restauranteId: string, culturaId: string): Promise<RestauranteEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND);
      
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturas", "estrellasMichellin"]})
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND);
    
        restaurante.culturas = [...restaurante.culturas, cultura];
        return await this.restauranteRepository.save(restaurante);
      }
    
    async findculturaByRestauranteIdculturaId(restauranteId: string, culturaId: string): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
       
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturas"]});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const restaurantecultura: CulturaGastronomicaEntity = restaurante.culturas.find(e => e.id === cultura.id);
   
        if (!restaurantecultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no esta asociada con el restaurante", BusinessError.PRECONDITION_FAILED)
   
        return restaurantecultura;
    }
    
    async findCulturasByRestauranteId(restauranteId: string): Promise<CulturaGastronomicaEntity[]> {
      
      const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      
      if(!cached){

          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturas"]});
          if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
          await this.cacheManager.set(this.cacheKey, restaurante.culturas);
          return restaurante.culturas;
      }
      return cached;
    }
    
    async associateCulturasRestaurante(restauranteId: string, culturas: CulturaGastronomicaEntity[]): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturas"]});
    
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < culturas.length; i++) {
          const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturas[i].id}});
          if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
        }
    
        restaurante.culturas = culturas;
        return await this.restauranteRepository.save(restaurante);
      }
    
    async deleteCulturaRestaurante(restauranteId: string, culturaId: string){
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturas"]});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const restaurantecultura: CulturaGastronomicaEntity = restaurante.culturas.find(e => e.id === cultura.id);
    
        if (!restaurantecultura)
            throw new BusinessLogicException("La cultura gastronómica con el id especificado no esta asociada con el restaurante", BusinessError.PRECONDITION_FAILED)
 
        restaurante.culturas = restaurante.culturas.filter(e => e.id !== culturaId);
        await this.restauranteRepository.save(restaurante);
    }  
}
