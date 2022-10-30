import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('CiudadRestauranteService', () => {
  let service: CiudadRestauranteService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  let restauranteList : RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadRestauranteService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<CiudadRestauranteService>(CiudadRestauranteService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();
    
 
    restauranteList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await restauranteRepository.save({
          nombre: faker.lorem.word()
        })
        restauranteList.push(restaurante);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.company.name(),
      restaurantes: restauranteList
    })
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCiudad should add an restaurante to a cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    const newcultura: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
    })
 
    const result: CiudadEntity = await service.addRestauranteCiudad(newcultura.id, newrestaurante.id);
   
    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newrestaurante.nombre)
   
  });

  it('addRestauranteCiudad should thrown exception for an invalid restaurante', async () => {
    const newcultura: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
    })
 
    await expect(() => service.addRestauranteCiudad(newcultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('addRestauranteCiudad should throw an exception for an invalid cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(() => service.addRestauranteCiudad("0", newrestaurante.id)).rejects.toHaveProperty("message", "La ciudad con el id especificado no existe");
  });

  it('findRestauranteByCiudadIdRestauranteId should return restaurante by cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    const storedrestaurante: RestauranteEntity = await service.findRestauranteByCiudadIdRestauranteId(ciudad.id, restaurante.id, )
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toBe(restaurante.nombre);
   
  });

  it('findRestauranteByCiudadIdRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findRestauranteByCiudadIdRestauranteId(ciudad.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findRestauranteByCiudadIdRestauranteId should throw an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.findRestauranteByCiudadIdRestauranteId("0", restaurante.id)).rejects.toHaveProperty("message", "La ciudad con el id especificado no existe");
  });

  it('findRestauranteByCiudadIdRestauranteId should throw an exception for an restaurante not associated to the cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.findRestauranteByCiudadIdRestauranteId(ciudad.id, newrestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no esta asociada con la ciudad");
  });

  it('findRestaurantesByCiudadId should return restaurantes by cultura', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesByCiudadId(ciudad.id);
    expect(restaurantes.length).toBe(5)
  });

  it('findRestaurantesByCiudadId should throw an exception for an invalid cultura', async () => {
    await expect(()=> service.findRestaurantesByCiudadId("0")).rejects.toHaveProperty("message", "La ciudad con el id especificado no existe");
  });

  it('associateRestaurantesCiudad should update restaurantes list for a cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    const updatedcultura: CiudadEntity = await service.associateRestaurantesCiudad(ciudad.id, [newrestaurante]);
    expect(updatedcultura.restaurantes.length).toBe(1);
 
    expect(updatedcultura.restaurantes[0].nombre).toBe(newrestaurante.nombre);
   
  });

  it('associateRestaurantesCiudad should throw an exception for an invalid cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.associateRestaurantesCiudad("0", [newrestaurante])).rejects.toHaveProperty("message", "La ciudad con el id especificado no existe");
  });

  it('associateRestaurantesCiudad should throw an exception for an invalid restaurante', async () => {
    const newrestaurante: RestauranteEntity = restauranteList[0];
    newrestaurante.id = "0";
 
    await expect(()=> service.associateRestaurantesCiudad(ciudad.id, [newrestaurante])).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleterestauranteTocultura should remove an restaurante from a cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
   
    await service.deleteRestauranteCiudad(ciudad.id, restaurante.id);
 
    const storedcultura: CiudadEntity = await ciudadRepository.findOne({where: {id: `${ciudad.id}`}, relations: ["restaurantes"]});
    const deletedrestaurante: RestauranteEntity = storedcultura.restaurantes.find(a => a.id === restaurante.id);
 
    expect(deletedrestaurante).toBeUndefined();
 
  });

  it('deleterestauranteTocultura should thrown an exception for an invalid restaurante', async () => {
    await expect(()=> service.deleteRestauranteCiudad(ciudad.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleterestauranteTocultura should thrown an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.deleteRestauranteCiudad("0", restaurante.id)).rejects.toHaveProperty("message", "La ciudad con el id especificado no existe");
  });

  it('deleterestauranteTocultura should thrown an exception for an non asocciated restaurante', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.deleteRestauranteCiudad(ciudad.id, newrestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no esta asociada con la ciudad");
  });
});
