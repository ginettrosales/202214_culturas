import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CiudadRestauranteService {

    cacheKey: string = "ciudades_restaurantes";
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
    
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}
 
    async addRestauranteCiudad(ciudadId: string, restauranteId: string): Promise<CiudadEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND);
      
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]})
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND);
    
        ciudad.restaurantes = [...ciudad.restaurantes, restaurante];
        return await this.ciudadRepository.save(ciudad);
      }
    
    async findRestauranteByCiudadIdRestauranteId(ciudadId: string, restauranteId: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
       
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const ciudadrestaurante: RestauranteEntity = ciudad.restaurantes.find(e => e.id === restaurante.id);
   
        if (!ciudadrestaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no esta asociada con la ciudad", BusinessError.PRECONDITION_FAILED)
   
        return ciudadrestaurante;
    }
    
    async findRestaurantesByCiudadId(ciudadId: string): Promise<RestauranteEntity[]> {
        const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey);
      
        if(!cached){
  
            const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
            if (!ciudad)
              throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND)
            await this.cacheManager.set(this.cacheKey, ciudad.restaurantes);
            return ciudad.restaurantes;
        }
        return cached;
    }
    
    async associateRestaurantesCiudad(ciudadId: string, restaurantes: RestauranteEntity[]): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
    
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < restaurantes.length; i++) {
          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restaurantes[i].id}});
          if (!restaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
        }
    
        ciudad.restaurantes = restaurantes;
        return await this.ciudadRepository.save(ciudad);
      }
    
    async deleteRestauranteCiudad(ciudadId: string, restauranteId: string){
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["restaurantes"]});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const ciudadrestaurante: RestauranteEntity = ciudad.restaurantes.find(e => e.id === restaurante.id);
    
        if (!ciudadrestaurante)
            throw new BusinessLogicException("El restaurante con el id especificado no esta asociada con la ciudad", BusinessError.PRECONDITION_FAILED)
 
        ciudad.restaurantes = ciudad.restaurantes.filter(e => e.id !== restauranteId);
        await this.ciudadRepository.save(ciudad);
    }  
}
