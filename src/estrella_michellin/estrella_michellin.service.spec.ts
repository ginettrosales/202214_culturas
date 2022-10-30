import { Test, TestingModule } from '@nestjs/testing';
import { EstrellaMichellinService } from './estrella_michellin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { CACHE_MANAGER } from '@nestjs/common';


const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}
describe('EstrellaMichellinService', () => {
  let service: EstrellaMichellinService;
  let repository: Repository<EstrellaMichellinEntity>;
  let estrellaList: EstrellaMichellinEntity[]
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstrellaMichellinService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<EstrellaMichellinService>(EstrellaMichellinService);
    repository = module.get<Repository<EstrellaMichellinEntity>>(getRepositoryToken(EstrellaMichellinEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estrellaList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: EstrellaMichellinEntity = await repository.save({
          fechaConsecucion: faker.company.name()
        })
        estrellaList.push(restaurante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurantes: EstrellaMichellinEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(estrellaList.length);
  });


  it('findOne should return a restaurant by id', async () => {
    const storedRestaurante: EstrellaMichellinEntity = estrellaList[0];
    const restaurante: EstrellaMichellinEntity = await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.fechaConsecucion).toEqual(storedRestaurante.fechaConsecucion)
  
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe")
  });


  it('create should return a new estrellamichellin', async () => {
    const restaurante: EstrellaMichellinEntity = {
      id: "",
      fechaConsecucion: faker.company.name(),
      restaurante: null
    }
 
    const newRestaurante: EstrellaMichellinEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();
 
    const storedRestaurante: EstrellaMichellinEntity = await repository.findOne({where: {id: newRestaurante.id}})
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.fechaConsecucion).toEqual(newRestaurante.fechaConsecucion)
  });

  
  it('update should modify a estrellamichellin', async () => {
    const restaurante: EstrellaMichellinEntity = estrellaList[0];
    restaurante.fechaConsecucion = "New name";
     const updatedestrellamichellin: EstrellaMichellinEntity = await service.update(restaurante.id, restaurante);
    expect(updatedestrellamichellin).not.toBeNull();
     const storedestrellamichellin: EstrellaMichellinEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(storedestrellamichellin).not.toBeNull();
    expect(storedestrellamichellin.fechaConsecucion).toEqual(restaurante.fechaConsecucion)
  });

  it('update should throw an exception for an invalid estrellamichellin', async () => {
    let restaurante: EstrellaMichellinEntity = estrellaList[0];
    restaurante = {
      ...restaurante, fechaConsecucion: "New name"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe")
  });

  it('delete should remove a estrellamichellin', async () => {
    const restaurante: EstrellaMichellinEntity = estrellaList[0];
    await service.delete(restaurante.id);
     const deletedRestaurante: EstrellaMichellinEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid estrellamichellin', async () => {
    const restaurante: EstrellaMichellinEntity = estrellaList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La estrella michellin con el id especificado no existe")
  });

});
