import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
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

describe('RestauranteCulturagastronomicaService', () => {
  let service: RestauranteCulturagastronomicaService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurante: RestauranteEntity;
  let culturaList : CulturaGastronomicaEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteCulturagastronomicaService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<RestauranteCulturagastronomicaService>(RestauranteCulturagastronomicaService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    restauranteRepository.clear();
 
    culturaList = [];
    for(let i = 0; i < 5; i++){
        const cultura: CulturaGastronomicaEntity = await culturaRepository.save({
          nombre: faker.lorem.word(),
          descripcion: faker.lorem.paragraph()
        })
        culturaList.push(cultura);
    }
 
    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      culturas: culturaList
    })
  }



  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulturaRestaurante should add an cultura to a restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    })
 
    const result: RestauranteEntity = await service.addCulturaRestaurante(newrestaurante.id, newcultura.id);
   
    expect(result.culturas.length).toBe(1);
    expect(result.culturas[0]).not.toBeNull();
    expect(result.culturas[0].nombre).toBe(newcultura.nombre)
    expect(result.culturas[0].descripcion).toBe(newcultura.descripcion)

  });

  it('addCulturaRestaurante should thrown exception for an invalid cultura', async () => {
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    })
 
    await expect(() => service.addCulturaRestaurante(newrestaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });


  it('addCulturaRestaurante should throw an exception for an invalid restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    await expect(() => service.addCulturaRestaurante("0", newcultura.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findculturaByRestauranteIdculturaId should return cultura by restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturaList[0];
    const storedcultura: CulturaGastronomicaEntity = await service.findculturaByRestauranteIdculturaId(restaurante.id, cultura.id, )
    expect(storedcultura).not.toBeNull();
    expect(storedcultura.nombre).toBe(cultura.nombre);
    expect(storedcultura.descripcion).toBe(cultura.descripcion);
  });

  it('findculturaByRestauranteIdculturaId should throw an exception for an invalid cultura', async () => {
    await expect(()=> service.findculturaByRestauranteIdculturaId(restaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('findculturaByRestauranteIdculturaId should throw an exception for an invalid restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturaList[0];
    await expect(()=> service.findculturaByRestauranteIdculturaId("0", cultura.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findculturaByRestauranteIdculturaId should throw an exception for an cultura not associated to the restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    await expect(()=> service.findculturaByRestauranteIdculturaId(restaurante.id, newcultura.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no esta asociada con el restaurante");
  });

  it('findCulturasByRestauranteId should return culturas by restaurante', async ()=>{
    const culturas: CulturaGastronomicaEntity[] = await service.findCulturasByRestauranteId(restaurante.id);
    expect(culturas.length).toBe(5)
  });

  it('findCulturasByRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findCulturasByRestauranteId("0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('associateCulturasRestaurante should update culturas list for a restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    const updatedrestaurante: RestauranteEntity = await service.associateCulturasRestaurante(restaurante.id, [newcultura]);
    expect(updatedrestaurante.culturas.length).toBe(1);
    expect(updatedrestaurante.culturas[0].nombre).toBe(newcultura.nombre);
    expect(updatedrestaurante.culturas[0].descripcion).toBe(newcultura.descripcion);
  });


  it('associateCulturasRestaurante should throw an exception for an invalid restaurante', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    await expect(()=> service.associateCulturasRestaurante("0", [newcultura])).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('associateCulturasRestaurante should throw an exception for an invalid cultura', async () => {
    const newcultura: CulturaGastronomicaEntity = culturaList[0];
    newcultura.id = "0";
 
    await expect(()=> service.associateCulturasRestaurante(restaurante.id, [newcultura])).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('deleteculturaTorestaurante should remove an cultura from a restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturaList[0];
   
    await service.deleteCulturaRestaurante(restaurante.id, cultura.id);
 
    const storedrestaurante: RestauranteEntity = await restauranteRepository.findOne({where: {id: restaurante.id}, relations: ["culturas"]});
    const deletedcultura: CulturaGastronomicaEntity = storedrestaurante.culturas.find(a => a.id === cultura.id);
 
    expect(deletedcultura).toBeUndefined();
 
  });

  it('deleteculturaTorestaurante should thrown an exception for an invalid cultura', async () => {
    await expect(()=> service.deleteCulturaRestaurante(restaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('deleteculturaTorestaurante should thrown an exception for an invalid restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturaList[0];
    await expect(()=> service.deleteCulturaRestaurante("0", cultura.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleteculturaTorestaurante should thrown an exception for an non asocciated cultura', async () => {
    const newcultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph()
    });
 
    await expect(()=> service.deleteCulturaRestaurante(restaurante.id, newcultura.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no esta asociada con el restaurante");
  });
});
