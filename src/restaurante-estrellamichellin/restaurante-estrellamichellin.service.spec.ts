import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteEstrellamichellinService } from './restaurante-estrellamichellin.service';
import { Repository } from 'typeorm';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
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

describe('RestauranteEstrellamichellinService', () => {
  let service: RestauranteEstrellamichellinService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let estrellaRepository: Repository<EstrellaMichellinEntity>;
  let restaurante: RestauranteEntity;
  let estrellaMichellinList : EstrellaMichellinEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteEstrellamichellinService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<RestauranteEstrellamichellinService>(RestauranteEstrellamichellinService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    estrellaRepository = module.get<Repository<EstrellaMichellinEntity>>(getRepositoryToken(EstrellaMichellinEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    estrellaRepository.clear();
    restauranteRepository.clear();
 
    estrellaMichellinList = [];
    for(let i = 0; i < 5; i++){
        const estrella: EstrellaMichellinEntity = await estrellaRepository.save({
          fechaConsecucion: faker.company.name()
        })
        estrellaMichellinList.push(estrella);
    }
 
    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichellin: estrellaMichellinList
    })
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addEstrellaRestaurante should add an artwork to a restaurante', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    const newrestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name()
    })
 
    const result: RestauranteEntity = await service.addEstrellaRestaurante(newrestaurante.id, newEstrella);
   
    expect(result.estrellasMichellin.length).toBe(1);
    expect(result.estrellasMichellin[0]).not.toBeNull();
    expect(result.estrellasMichellin[0].fechaConsecucion).toBe(newEstrella.fechaConsecucion)
  });



  it('addEstrellaRestaurante should throw an exception for an invalid restaurante', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    await expect(() => service.addEstrellaRestaurante("0", newEstrella)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findEstrellaByRestauranteIdEstrellaId should return artwork by restaurante', async () => {
    const estrella: EstrellaMichellinEntity = estrellaMichellinList[0];
    const storedEstrella: EstrellaMichellinEntity = await service.findEstrellaByRestauranteIdEstrellaId(restaurante.id, estrella.id, )
    expect(storedEstrella).not.toBeNull();
    expect(storedEstrella.fechaConsecucion).toBe(estrella.fechaConsecucion);
  });

  it('findEstrellaByRestauranteIdEstrellaId should throw an exception for an invalid artwork', async () => {
    await expect(()=> service.findEstrellaByRestauranteIdEstrellaId(restaurante.id, "0")).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe");
  });

  it('findEstrellaByRestauranteIdEstrellaId should throw an exception for an invalid restaurante', async () => {
    const estrella: EstrellaMichellinEntity = estrellaMichellinList[0];
    await expect(()=> service.findEstrellaByRestauranteIdEstrellaId("0", estrella.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('findEstrellaByRestauranteIdEstrellaId should throw an exception for an artwork not associated to the restaurante', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    await expect(()=> service.findEstrellaByRestauranteIdEstrellaId(restaurante.id, newEstrella.id)).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no esta asociada con el restaurante");
  });

  it('findEstrellasByRestauranteId should return estrella by restaurante', async ()=>{
    const estrella: EstrellaMichellinEntity[] = await service.findEstrellasByRestauranteId(restaurante.id);
    expect(estrella.length).toBe(5)
  });

  it('findEstrellasByRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findEstrellasByRestauranteId("0")).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('associateEstrellasRestaurante should update estrella list for a restaurante', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    const updatedrestaurante: RestauranteEntity = await service.associateEstrellasRestaurante(restaurante.id, [newEstrella]);
    expect(updatedrestaurante.estrellasMichellin.length).toBe(1);
    expect(updatedrestaurante.estrellasMichellin[0].fechaConsecucion).toBe(newEstrella.fechaConsecucion);
  });


  it('associateEstrellasRestaurante should throw an exception for an invalid restaurante', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    await expect(()=> service.associateEstrellasRestaurante("0", [newEstrella])).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('associateEstrellasRestaurante should throw an exception for an invalid artwork', async () => {
    const newEstrella: EstrellaMichellinEntity = estrellaMichellinList[0];
    newEstrella.id = "0";
 
    await expect(()=> service.associateEstrellasRestaurante(restaurante.id, [newEstrella])).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe");
  });

  it('deleteArtworkTorestaurante should remove an artwork from a restaurante', async () => {
    const estrella: EstrellaMichellinEntity = estrellaMichellinList[0];
   
    await service.deleteEstrellaRestaurante(restaurante.id, estrella.id);
 
    const storedrestaurante: RestauranteEntity = await restauranteRepository.findOne({where: {id: restaurante.id}, relations: ["estrellasMichellin"]});
    const deletedEstrella: EstrellaMichellinEntity = storedrestaurante.estrellasMichellin.find(a => a.id === estrella.id);
 
    expect(deletedEstrella).toBeUndefined();
 
  });

  it('deleteArtworkTorestaurante should thrown an exception for an invalid artwork', async () => {
    await expect(()=> service.deleteEstrellaRestaurante(restaurante.id, "0")).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe");
  });

  it('deleteArtworkTorestaurante should thrown an exception for an invalid restaurante', async () => {
    const estrella: EstrellaMichellinEntity = estrellaMichellinList[0];
    await expect(()=> service.deleteEstrellaRestaurante("0", estrella.id)).rejects.toHaveProperty("message", "El restaurante con el id especificado no existe");
  });

  it('deleteArtworkTorestaurante should thrown an exception for an non asocciated artwork', async () => {
    const newEstrella: EstrellaMichellinEntity = await estrellaRepository.save({
      fechaConsecucion: faker.company.name()
    });
 
    await expect(()=> service.deleteEstrellaRestaurante(restaurante.id, newEstrella.id)).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no esta asociada con el restaurante");
  });

});
