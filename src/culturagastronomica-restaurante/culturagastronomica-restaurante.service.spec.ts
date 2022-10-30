import { Test, TestingModule } from '@nestjs/testing';
import { CulturagastronomicaRestauranteService } from './culturagastronomica-restaurante.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CACHE_MANAGER } from '@nestjs/common';


const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}


describe('CulturagastronomicaRestauranteService', () => {
  let service: CulturagastronomicaRestauranteService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let cultura: CulturaGastronomicaEntity;
  let restauranteList : RestauranteEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturagastronomicaRestauranteService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<CulturagastronomicaRestauranteService>(CulturagastronomicaRestauranteService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });


  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaRepository.clear();
    
 
    restauranteList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await restauranteRepository.save({
          nombre: faker.lorem.word()
        })
        restauranteList.push(restaurante);
    }
 
    cultura = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(), 
      restaurantes: restauranteList
    })
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCultura should add an restaurante to a cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })
 
    const result: CulturaGastronomicaEntity = await service.addRestauranteCultura(newcultura.id, newrestaurante.id);
   
    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newrestaurante.nombre)
   
  });

  it('addRestauranteCultura should thrown exception for an invalid restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })
 
    await expect(() => service.addRestauranteCultura(newcultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('addRestauranteCultura should throw an exception for an invalid cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(() => service.addRestauranteCultura("0", newrestaurante.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('findRestauranteByCulturaIdRestauranteId should return restaurante by cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    const storedrestaurante: RestauranteEntity = await service.findRestauranteByCulturaIdRestauranteId(cultura.id, restaurante.id, )
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toBe(restaurante.nombre);
   
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId("0", restaurante.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an restaurante not associated to the cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, newrestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no esta asociada con la cultura gastronómica");
  });

  it('findRestaurantesByCulturaId should return restaurantes by cultura', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesByCulturaId(cultura.id);
    expect(restaurantes.length).toBe(5)
  });

  it('findRestaurantesByCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(()=> service.findRestaurantesByCulturaId("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('associateRestaurantesCultura should update restaurantes list for a cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    const updatedcultura: CulturaGastronomicaEntity = await service.associateRestaurantesCultura(cultura.id, [newrestaurante]);
    expect(updatedcultura.restaurantes.length).toBe(1);
 
    expect(updatedcultura.restaurantes[0].nombre).toBe(newrestaurante.nombre);
   
  });

  it('associateRestaurantesCultura should throw an exception for an invalid cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.associateRestaurantesCultura("0", [newrestaurante])).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('associateRestaurantesCultura should throw an exception for an invalid restaurante', async () => {
    const newrestaurante: RestauranteEntity = restauranteList[0];
    newrestaurante.id = "0";
 
    await expect(()=> service.associateRestaurantesCultura(cultura.id, [newrestaurante])).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleterestauranteTocultura should remove an restaurante from a cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
   
    await service.deleteRestauranteCultura(cultura.id, restaurante.id);
 
    const storedcultura: CulturaGastronomicaEntity = await culturaRepository.findOne({where: {id: cultura.id}, relations: ["restaurantes"]});
    const deletedrestaurante: RestauranteEntity = storedcultura.restaurantes.find(a => a.id === restaurante.id);
 
    expect(deletedrestaurante).toBeUndefined();
 
  });

  it('deleterestauranteTocultura should thrown an exception for an invalid restaurante', async () => {
    await expect(()=> service.deleteRestauranteCultura(cultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleterestauranteTocultura should thrown an exception for an invalid cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.deleteRestauranteCultura("0", restaurante.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('deleterestauranteTocultura should thrown an exception for an non asocciated restaurante', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    });
 
    await expect(()=> service.deleteRestauranteCultura(cultura.id, newrestaurante.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no esta asociada con la cultura gastronómica");
  });

});