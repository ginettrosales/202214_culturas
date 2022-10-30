import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity} from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturasList: CulturaGastronomicaEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();
    
    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });
  
  const seedDatabase = async () => {
    repository.clear();
    culturasList = [];
    for(let i = 0; i < 5; i++){
      const cultura: CulturaGastronomicaEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.paragraph()})
        culturasList.push(cultura);
  }
}

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las culturas gastronomicas', async () => {
    const culturas: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturas).not.toBeNull();
    expect(culturas).toHaveLength(culturasList.length);
  });

  it('findOne debe retornar una cultura por su id', async () => {
    const storedCultura: CulturaGastronomicaEntity = culturasList[0];
    const cultura: CulturaGastronomicaEntity = await service.findOne(storedCultura.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(storedCultura.nombre)
    expect(cultura.descripcion).toEqual(storedCultura.descripcion)
  });

  it('findOne debe retornar excepcion para una cultura invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe")
  });

  it('create debe retornar una nueva cultura', async () => {
    const cultura: CulturaGastronomicaEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      productos: [],
      recetas: [],
      restaurantes: [],
      paises:[],
    }

    const nuevaCultura: CulturaGastronomicaEntity = await service.create(cultura);
    expect(nuevaCultura).not.toBeNull();
 
    const storedCultura: CulturaGastronomicaEntity = await repository.findOne({where: {id: nuevaCultura.id}})
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(nuevaCultura.nombre)
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.descripcion).toEqual(nuevaCultura.descripcion)
  });

  it('update debe modificar una cultura', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    cultura.nombre = "Nuevo nombre";
    cultura.descripcion = "Nueva descripcion de una cultura";
     const updatedCultura: CulturaGastronomicaEntity = await service.update(cultura.id, cultura);
    expect(updatedCultura).not.toBeNull();
     const storedCultura: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(cultura.nombre)
    expect(storedCultura.descripcion).toEqual(cultura.descripcion)
  });

  it('update debe retornar una excepcion por una cultura invalida', async () => {
    let cultura: CulturaGastronomicaEntity = culturasList[0];
    cultura = {
      ...cultura, nombre: "Nuevo nombre", descripcion: "Nueva descripcion de una cultura"
    }
    await expect(() => service.update("0", cultura)).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe")
  });

  it('delete debe remover una cultura', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    await service.delete(cultura.id);
     const deletedCultura: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(deletedCultura).toBeNull();
  });

  it('delete debe retornar una excepcion por una cultura invalida', async () => {
    let cultura: CulturaGastronomicaEntity = culturasList[0];
    await service.delete(cultura.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe")
  });  
});