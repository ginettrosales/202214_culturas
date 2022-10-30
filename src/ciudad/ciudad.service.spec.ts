import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CACHE_MANAGER } from '@nestjs/common';


const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.lorem.word(),
      });
      ciudadesList.push(ciudad);
    }
  };

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne debe retornar un ciudad por su id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
  });

  it('findOne debe retornar excepcion para un ciudad invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty(
      'message',
      'La ciudad con el identificador especificado no existe',
    );
  });

  it('create debe crear un ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.lorem.word(),
      restaurantes:[],
      pais:null
    };
    const createdCiudad: CiudadEntity = await service.create(ciudad);
    expect(createdCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await service.findOne(createdCiudad.id);
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(createdCiudad.nombre);
  });

  it('update debe actualizar un ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = faker.lorem.word();
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({ where: { id: `${ciudad.id}`} });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(updatedCiudad.nombre);
  });

  it('update debe retornar excepcion para un ciudad invalido', async () => {
    let ciudad: CiudadEntity = ciudadesList[0];
    ciudad = {...ciudad,nombre: "New name"};
    await expect(() =>
      service.update("0", ciudad),
    ).rejects.toHaveProperty(
      'message',
      'La ciudad con el identificador especificado no existe',
    );
  });

  it('delete debe eliminar un ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).toBeNull();
  });

  it('delete debe retornar excepcion para un ciudad invalido', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty(
      'message',
      'La ciudad con el identificador especificado no existe',
    );
  });
});
