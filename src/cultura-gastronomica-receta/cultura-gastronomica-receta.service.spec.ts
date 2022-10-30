import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('CulturaGastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let cultura: CulturaGastronomicaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRecetaService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(CulturaGastronomicaRecetaService);
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));

    await seedDatabase();
  });
  
  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaRepository.clear();
    
    recetasList = [];
    for(let i = 0; i < 5; i++){
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.paragraph(),
        foto: faker.lorem.word(),
        preparacion: faker.lorem.paragraph(),
        video: faker.lorem.word()
      })
      recetasList.push(receta);
    }
 
    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      recetas: recetasList
    })
  }
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaToCulturaGastronomica debe agregar una receta a una cultura gastronómica', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
 
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    })
 
    const result: CulturaGastronomicaEntity = await service.addRecetaToCulturaGastronomica(nuevaCultura.id, nuevoReceta.id);
   
    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(nuevoReceta.nombre)
    expect(result.recetas[0].descripcion).toBe(nuevoReceta.descripcion)
    expect(result.recetas[0].foto).toBe(nuevoReceta.foto)
    expect(result.recetas[0].preparacion).toBe(nuevoReceta.preparacion)    
    expect(result.recetas[0].video).toBe(nuevoReceta.video)
  });

  it('addRecetaToCulturaGastronomica debe retornar un error por receta invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    })
 
    await expect(() => service.addRecetaToCulturaGastronomica(nuevaCultura.id, "0")).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe");
  });

  it('addRecetaToCulturaGastronomica debe retornar un error por receta invalido', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
 
    await expect(() => service.addRecetaToCulturaGastronomica("0", nuevoReceta.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('findRecetaCulturaGastronomicaIdRecetaId retorna un receta invalido', async () => {
    const receta: RecetaEntity = recetasList[0];
    const storedReceta: RecetaEntity = await service.findRecetaCulturaGastronomicaIdRecetaId(cultura.id, receta.id,)
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(receta.nombre);
    expect(storedReceta.descripcion).toBe(receta.descripcion);
    expect(storedReceta.foto).toBe(receta.foto);
    expect(storedReceta.preparacion).toBe(receta.preparacion);
    expect(storedReceta.video).toBe(receta.video);
  });

  it('findRecetasByCulturaGastronomicaId debe retornar los recetas asociados a una cultura gastronomica', async ()=>{
    const recetas: RecetaEntity[] = await service.findRecetasByCulturaGastronomicaId(cultura.id);
    expect(recetas.length).toBe(5)
  });

  it('findRecetasByCulturaGastronomicaId debe retornar una execpcion por una cultura gastronomica invalida', async () => {
    await expect(()=> service.findRecetasByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('associateRecetasCulturaGastronomica debe actualizar la lista de receta de una cultura gastronomica', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
 
    const updatedCultura: CulturaGastronomicaEntity = await service.associateRecetasCulturaGastronomica(cultura.id, [nuevoReceta]);
    expect(updatedCultura.recetas.length).toBe(1);
    expect(updatedCultura.recetas[0].nombre).toBe(nuevoReceta.nombre);
    expect(updatedCultura.recetas[0].descripcion).toBe(nuevoReceta.descripcion);
    expect(updatedCultura.recetas[0].foto).toBe(nuevoReceta.foto);
    expect(updatedCultura.recetas[0].preparacion).toBe(nuevoReceta.preparacion);    
    expect(updatedCultura.recetas[0].video).toBe(nuevoReceta.video);
  });
  
  it('associateRecetasCulturaGastronomica debe retornar error por una cultura invalida', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
 
    await expect(()=> service.associateRecetasCulturaGastronomica("0", [nuevoReceta])).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('associateRecetasCulturaGastronomica debe retornar una execepcion por un receta invalido', async () => {
    const nuevoReceta: RecetaEntity = recetasList[0];
    nuevoReceta.id = "0";
 
    await expect(()=> service.associateRecetasCulturaGastronomica(cultura.id, [nuevoReceta])).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe");
  });

  it('deleteRecetaCulturaGastronomica debe remover un receta de una cultura gastronomica', async () => {
    const receta: RecetaEntity = recetasList[0];
   
    await service.deleteRecetaCulturaGastronomica(cultura.id, receta.id);
 
    const storedCultura: CulturaGastronomicaEntity = await culturaRepository.findOne({where: {id: cultura.id}, relations: ["productos", "recetas"]});
    const deletedReceta: RecetaEntity = storedCultura.recetas.find(a => a.id === receta.id);
 
    expect(deletedReceta).toBeUndefined();
  });

  it('deleteRecetaCulturaGastronomica debe retornar una excepcion por un receta invalido', async () => {
    await expect(()=> service.deleteRecetaCulturaGastronomica(cultura.id, "0")).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe");
  });

  it('deleteRecetaCulturaGastronomica debe retornar una excepcion por una cultura gastronomica invalida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(()=> service.deleteRecetaCulturaGastronomica("0", receta.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id especificado no existe");
  });

  it('deleteRecetaCulturaGastronomica devuelve una excepcion por una receta que no esta asociada a una cultura gastronomica', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
 
    await expect(()=> service.deleteRecetaCulturaGastronomica(cultura.id, nuevoReceta.id)).rejects.toHaveProperty("message", "La receta con el identificador especificado no esta asociado a la cultura gastronómica");
  });
 

});
