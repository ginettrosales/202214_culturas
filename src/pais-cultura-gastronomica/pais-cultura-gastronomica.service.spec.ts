import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('PaisCulturaGastronomicaService', () => {
  let service: PaisCulturaGastronomicaService;
  let paisRepository: Repository<PaisEntity>;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let pais: PaisEntity;
  let culturasList : CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCulturaGastronomicaService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<PaisCulturaGastronomicaService>(PaisCulturaGastronomicaService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    paisRepository.clear();

    culturasList = [];
    for(let i = 0; i < 5; i++){
        const cultura: CulturaGastronomicaEntity = await culturaRepository.save({
          nombre: faker.lorem.word(),
          descripcion: faker.lorem.sentence()
        })
        culturasList.push(cultura);
    }

    pais = await paisRepository.save({
      nombre: faker.lorem.word(), 
      culturas: culturasList
    })
  }

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });   
  
  it('addCulturaGastronomicaPais se debe agregar una cultura gatronomica a un pais', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });

    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.word(),
    })

    const result: PaisEntity = await service.addCulturaGastronomicaPais(nuevoPais.id, nuevaCultura.id);
    
    expect(result.culturas.length).toBe(1);
    expect(result.culturas[0]).not.toBeNull();
    expect(result.culturas[0].nombre).toBe(nuevaCultura.nombre)
    expect(result.culturas[0].descripcion).toBe(nuevaCultura.descripcion)
  });

  it('addCulturaGastronomicaPais devuelve una excepcion por una cultura gastronomica invalida', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.word(),
    })
 
    await expect(() => service.addCulturaGastronomicaPais(nuevoPais.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('addCulturaGastronomicaPais devuelve una excepcion por una cultura gastronomica invalida', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(() => service.addCulturaGastronomicaPais("0", nuevaCultura.id)).rejects.toHaveProperty("message", "El pais con el identificador especificado no existe");
  });

  it('findCulturaByPaisIdCulturaId retorna una cultura gastronomica de un pais', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    const storedPais: CulturaGastronomicaEntity = await service.findCulturaByPaisIdCulturaId(pais.id, cultura.id, )
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(cultura.nombre);
    expect(storedPais.descripcion).toBe(cultura.descripcion);
  });

  it('findCulturaByPaisIdCulturaId retorna una excepcion por una cultura invalida', async () => {
    await expect(()=> service.findCulturaByPaisIdCulturaId(pais.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('findCulturaByPaisIdCulturaId retorna una excepcion por un pais invalido', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    await expect(()=> service.findCulturaByPaisIdCulturaId("0", cultura.id)).rejects.toHaveProperty("message", "El pais con el identificador especificado no existe");
  });

  it('findCulturaByPaisIdCulturaId retorna una excepcion por una cultura gastronomica que no esta asociada a un pais', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.findCulturaByPaisIdCulturaId(pais.id, nuevaCultura.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no está asociada al país");
  });

  it('findCulturasByPaisId retorna todas las culturas gastronomicas de un pais', async ()=>{
    const culturas: CulturaGastronomicaEntity[] = await service.findCulturasByPaisId(pais.id);
    expect(culturas.length).toBe(5)
  });

  it('findCulturasByPaisId retorna una execpcion por un pais invalido', async () => {
    await expect(()=> service.findCulturasByPaisId("0")).rejects.toHaveProperty("message", "El pais con el identificador especificado no existe");
  });

  it('associateCulturasPais actualiza la lista de culturas gastronomicas de un pais', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });
 
    const updatedPais: PaisEntity = await service.associateCulturasPais(pais.id, [nuevaCultura]);
    expect(updatedPais.culturas.length).toBe(1);
    expect(updatedPais.culturas[0].nombre).toBe(nuevaCultura.nombre);
    expect(updatedPais.culturas[0].descripcion).toBe(nuevaCultura.descripcion);
  });

  it('associateCulturasPais devuelve una excepcion por un pais invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateCulturasPais("0", [nuevaCultura])).rejects.toHaveProperty("message", "El pais con el identificador especificado no existe");
  });

  it('associateCulturasPais devuelve una excepcion por una cultura gastronomica invalida', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = culturasList[0];
    nuevaCultura.id = "0";
 
    await expect(()=> service.associateCulturasPais(pais.id, [nuevaCultura])).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('deleteCulturaPais debe eliminar una cultura gastronómica de un pais', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
   
    await service.deleteCulturaPais(pais.id, cultura.id);
 
    const storedPais: PaisEntity = await paisRepository.findOne({where: {id: `${pais.id}`}, relations: ["culturas", "ciudades"]});
    const deletedCultura: CulturaGastronomicaEntity = storedPais.culturas.find(a => a.id === cultura.id);
 
    expect(deletedCultura).toBeUndefined();
 
  });

  it('deleteCulturaPais devuelve una excepcion por una cultura gastronomica invalida', async () => {
    await expect(()=> service.deleteCulturaPais(pais.id, "0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('deleteCulturaPais devuelve excepcion por una cultura gastonica invalida', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    await expect(()=> service.deleteCulturaPais("0", cultura.id)).rejects.toHaveProperty("message", "El pais con el identificador especificado no existe");
  });

  it('deleteCulturaPais devuelve excepcion por una cultura gastronomica que no esta asoiciadaa un pais', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence()
    });
    await expect(()=> service.deleteCulturaPais(pais.id, nuevaCultura.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no está asociada al país");
  });
});
