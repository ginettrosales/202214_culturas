import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: faker.lorem.word(),
      });
      paisesList.push(pais);
    }
  };

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisesList.length);
  });

  it('findOne debe retornar un pais por su id', async () => {
    const storedPais: PaisEntity = paisesList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
  });

  it('findOne debe retornar excepcion para un pais invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El país con el identificador especificado no existe',
    );
  });

  it('create debe crear un pais', async () => {
    const pais: PaisEntity = {
      id: "",
      nombre: faker.lorem.word(),
      ciudades: [],
      culturas: []
    };
    const createdPais: PaisEntity = await service.create(pais);
    expect(createdPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: `${createdPais.id}` },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
  });

  it('update debe actualizar un pais', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = faker.lorem.word();
    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();
    const storedPais: PaisEntity = await repository.findOne({
      where: { id: `${pais.id}` },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
  });

  it('update debe retornar excepcion para un pais invalido', async () => {
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais, nombre : "New Name"
      
    };
    await expect(() => service.update("0", pais)).rejects.toHaveProperty(
      'message',
      'El país con el identificador especificado no existe',
    );
  });

  it('delete debe eliminar un pais', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    const storedPais: PaisEntity = await repository.findOne({where: { id: `${pais.id}`}})
    expect(storedPais).toBeNull();
  });

  it('delete debe retornar excepcion para un pais invalido', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      'message',
      'El país con el identificador especificado no existe',
    );
  });
});
