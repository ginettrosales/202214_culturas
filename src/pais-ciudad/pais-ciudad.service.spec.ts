import { Test, TestingModule } from '@nestjs/testing';
import { PaisEntity } from '../pais/pais.entity';
import { PaisCiudadService } from './pais-ciudad.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('PaisCiudadService', () => {
  let service: PaisCiudadService;
  let paisRepository: Repository<PaisEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let pais: PaisEntity;
  let ciudadList : CiudadEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCiudadService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<PaisCiudadService>(PaisCiudadService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });


  const seedDatabase = async () => {
    ciudadRepository.clear();
    paisRepository.clear();
 
    ciudadList = [];
    for(let i = 0; i < 5; i++){
        const cultura: CiudadEntity = await ciudadRepository.save({
          nombre: faker.lorem.word(),
          descripcion: faker.lorem.paragraph()
        })
        ciudadList.push(cultura);
    }
 
    pais = await paisRepository.save({
      nombre: faker.company.name(),
      ciudades: ciudadList,
      culturas:[]
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
