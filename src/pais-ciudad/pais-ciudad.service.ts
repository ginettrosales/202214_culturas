import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {BusinessError,BusinessLogicException} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisCiudadService {
  cacheKey: string = "pais_ciudad";
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
  ) {}

  async addCiudadToPais(idPais: string, idCiudad: string): Promise<PaisEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: idCiudad },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: idPais },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    pais.ciudades = [...pais.ciudades, ciudad];
    return await this.paisRepository.save(pais);
  }

  async findCiudadByPaisIdCiudadId(
    idPais: string,
    idCiudad: string,
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: idCiudad },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: idPais },
      relations: ['ciudades']
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );
 
    const paisCiudad: CiudadEntity = pais.ciudades.find(
      e => e.id === ciudad.id,
    );

    if (!paisCiudad)
      throw new BusinessLogicException(
        'La ciudad con el id especificado no existe en el país especificado',
        BusinessError.PRECONDITION_FAILED,
      );

    return paisCiudad;
  }

  async findCiudadesByPaisId(idPais: string): Promise<CiudadEntity[]> {
  
    const cached: CiudadEntity[] = await this.cacheManager.get<CiudadEntity[]>(this.cacheKey);
      
    if(!cached){

        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: idPais}, relations: ['ciudades']});
        if (!pais)
          throw new BusinessLogicException("La ciudad con el id especificado no existe", BusinessError.NOT_FOUND)
        await this.cacheManager.set(this.cacheKey, pais.ciudades);
        return pais.ciudades;
    }
    return cached;

  }

  async associateCiudadesToPais(
    idPais: string,
    ciudades: CiudadEntity[],
  ): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: idPais },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el id especificado no existe',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < ciudades.length; i++) {
      const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
        where: { id: `${ciudades[i].id}` },
      });
      if (!ciudad)
        throw new BusinessLogicException(
          'La ciudad con el id especificado no existe',
          BusinessError.NOT_FOUND,
        );
    }

    pais.ciudades = ciudades;
    return await this.paisRepository.save(pais);
  }

  async removeCiudadFromPais(idPais: string, idCiudad: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: idCiudad },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'La ciudad con el identificador especificado no existe',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: idPais },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'El país con el identificador especificado no existe',
        BusinessError.NOT_FOUND,
      );

    const paisCiudad: CiudadEntity = pais.ciudades.find(
      e => e.id === ciudad.id,
    );
    if (!paisCiudad)
      throw new BusinessLogicException(
        'La ciudad con el identificador especificado no existe en el país especificado',
        BusinessError.PRECONDITION_FAILED,
      );

    pais.ciudades = pais.ciudades.filter(e => e.id !== idCiudad);
    await this.paisRepository.save(pais);
  }
}
