import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from './restaurante.entity';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/common';


const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}
describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restauranteList: RestauranteEntity[]
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });


  const seedDatabase = async () => {
    repository.clear();
    restauranteList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name()
        })
        restauranteList.push(restaurante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restauranteList.length);
  });


  it('findOne should return a restaurant by id', async () => {
    const storedRestaurante: RestauranteEntity = restauranteList[0];
    const restaurante: RestauranteEntity = await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre)
  
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe")
  });


  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.company.name(),
      estrellasMichellin: [],
      culturas:[],
      ciudad:null
    }
 
    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();
 
    const storedRestaurante: RestauranteEntity = await repository.findOne({where: {id: newRestaurante.id}})
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre)
  });

  
  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    restaurante.nombre = "New name";
     const updatedrestaurante: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(updatedrestaurante).not.toBeNull();
     const storedrestaurante: RestauranteEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toEqual(restaurante.nombre)
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restauranteList[0];
    restaurante = {
      ...restaurante, nombre: "New name"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe")
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.id);
     const deletedRestaurante: RestauranteEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe")
  });

});
