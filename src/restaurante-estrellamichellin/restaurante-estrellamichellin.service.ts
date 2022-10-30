import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteEstrellamichellinService {

  cacheKey: string = "restaurantes_estrellas";

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(EstrellaMichellinEntity)
        private readonly estrellaRepository: Repository<EstrellaMichellinEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}


    async addEstrellaRestaurante(restauranteId: string, estrella: EstrellaMichellinEntity): Promise<RestauranteEntity> {
        
        const estr : EstrellaMichellinEntity =  await this.estrellaRepository.save(estrella);
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["estrellasMichellin"]})
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND);
    
        restaurante.estrellasMichellin = [...restaurante.estrellasMichellin, estr];
        return await this.restauranteRepository.save(restaurante);
      }
    
    async findEstrellaByRestauranteIdEstrellaId(restauranteId: string, estrellaId: string): Promise<EstrellaMichellinEntity> {
        const estrella: EstrellaMichellinEntity = await this.estrellaRepository.findOne({where: {id: estrellaId}});
        if (!estrella)
          throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND)
       
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["estrellasMichellin"]});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const restauranteestrella: EstrellaMichellinEntity = restaurante.estrellasMichellin.find(e => e.id === estrella.id);
   
        if (!restauranteestrella)
          throw new BusinessLogicException("La estrella michellin con el id especificado no esta asociada con el restaurante", BusinessError.PRECONDITION_FAILED)
   
        return restauranteestrella;
    }
    
    async findEstrellasByRestauranteId(restauranteId: string): Promise<EstrellaMichellinEntity[]> {
   
      const cached: EstrellaMichellinEntity[] = await this.cacheManager.get<EstrellaMichellinEntity[]>(this.cacheKey);
      
        if(!cached){
  
          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["estrellasMichellin"]});
          if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
          await this.cacheManager.set(this.cacheKey, restaurante.estrellasMichellin);
          return restaurante.estrellasMichellin;
        }
        return cached;
    }
    
    async associateEstrellasRestaurante(restauranteId: string, estrellas: EstrellaMichellinEntity[]): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["estrellasMichellin"]});
    
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < estrellas.length; i++) {
          const estrella: EstrellaMichellinEntity = await this.estrellaRepository.findOne({where: {id: estrellas[i].id}});
          if (!estrella)
            throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND)
        }
    
        restaurante.estrellasMichellin = estrellas;
        return await this.restauranteRepository.save(restaurante);
      }
    
    async deleteEstrellaRestaurante(restauranteId: string, estrellaId: string){
        const estrella: EstrellaMichellinEntity = await this.estrellaRepository.findOne({where: {id: estrellaId}});
        if (!estrella)
          throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["estrellasMichellin"]});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const restauranteestrella: EstrellaMichellinEntity = restaurante.estrellasMichellin.find(e => e.id === estrella.id);
    
        if (!restauranteestrella)
            throw new BusinessLogicException("La estrella michellin con el id especificado no esta asociada con el restaurante", BusinessError.PRECONDITION_FAILED)
 
        restaurante.estrellasMichellin = restaurante.estrellasMichellin.filter(e => e.id !== estrellaId);
        this.estrellaRepository.remove(estrella);
        await this.restauranteRepository.save(restaurante);
    }  
}
