import { Injectable } from '@nestjs/common';
import { EstrellaMichellinEntity } from './estrella_michellin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class EstrellaMichellinService {

    cacheKey: string = "estrellas";
    constructor(
        @InjectRepository(EstrellaMichellinEntity)
        private readonly restauranteRepository: Repository<EstrellaMichellinEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<EstrellaMichellinEntity[]> {

        const cached: EstrellaMichellinEntity[] = await this.cacheManager.get<EstrellaMichellinEntity[]>(this.cacheKey);
      
        if(!cached){
            const estrellas: EstrellaMichellinEntity[] = await this.restauranteRepository.find();
            await this.cacheManager.set(this.cacheKey, estrellas);
            return estrellas;
        }
 
        return cached;

    }

    async findOne(id: string): Promise<EstrellaMichellinEntity> {
        const restaurante: EstrellaMichellinEntity = await this.restauranteRepository.findOne({where: {id} } );
        if (!restaurante)
          throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND);
   
        return restaurante;
    }

    async create(restaurante: EstrellaMichellinEntity): Promise<EstrellaMichellinEntity> {
        return await this.restauranteRepository.save(restaurante);
    }

    async update(id: string, restaurante: EstrellaMichellinEntity): Promise<EstrellaMichellinEntity> {
        const persistedEstrella: EstrellaMichellinEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!persistedEstrella)
          throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND);
          
        restaurante.id = id; 
        return await this.restauranteRepository.save(restaurante);
    }

    async delete(id: string) {
        const restaurante: EstrellaMichellinEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!restaurante)
          throw new BusinessLogicException("La estrella michellin con el id especificado no existe", BusinessError.NOT_FOUND);
     
        await this.restauranteRepository.remove(restaurante);
    }


}
