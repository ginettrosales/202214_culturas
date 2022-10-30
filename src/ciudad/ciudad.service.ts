import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {BusinessError,BusinessLogicException,} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CiudadService {
  cacheKey: string = "ciudades";
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CiudadEntity[]> {

    const cached: CiudadEntity[] = await this.cacheManager.get<CiudadEntity[]>(this.cacheKey);
      
       if(!cached){
           const ciudades: CiudadEntity[] = await this.ciudadRepository.find({ relations: ["pais", "restaurantes"]});
           await this.cacheManager.set(this.cacheKey, ciudades);
           return ciudades;
       }

       return cached;
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ["pais", "restaurantes"],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el identificador especificado no existe',
        BusinessError.NOT_FOUND,
      );

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: { id }});
    if (!persistedCiudad)
      throw new BusinessLogicException('La ciudad con el identificador especificado no existe',BusinessError.NOT_FOUND);
    return await this.ciudadRepository.save({ ...persistedCiudad, ...ciudad });
  }

  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: { id }});
    if (!ciudad)
      throw new BusinessLogicException('La ciudad con el identificador especificado no existe',BusinessError.NOT_FOUND);

    await this.ciudadRepository.remove(ciudad);
  }
}
