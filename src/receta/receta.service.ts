import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors'
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {
    //clase que implementa la lógica
    cacheKey: string = "recetas";
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}
    
    //Obtener todas las recetas
    async findAll(): Promise<RecetaEntity[]> {
        const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
        
        if(!cached){
            const recetas: RecetaEntity[] = await this.recetaRepository.find({  relations: ["productos", "cultura"] });
            await this.cacheManager.set(this.cacheKey, recetas);
            return recetas;
        }
 
        return cached;
    }

    //Obtener una receta
    async findOne(id: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id}, relations: ["productos", "cultura"] } );
        if (!receta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND);
   
        return receta;
    }

    //Crear una receta
    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    //Actualizar una receta por id
    async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({where:{id}});
        if (!persistedReceta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND);
        
        return await this.recetaRepository.save({...persistedReceta, ...receta});
    }

    //Borrar una receta
    async delete(id: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where:{id}});
        if (!receta)
          throw new BusinessLogicException("La receta con el identificador especificado no existe", BusinessError.NOT_FOUND);
     
        await this.recetaRepository.remove(receta);
    }
}
