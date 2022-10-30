import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();
 
    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for(let i = 0; i < 5; i++){
      const receta: RecetaEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.paragraph(),
        foto: faker.lorem.word(),
        preparacion: faker.lorem.paragraph(),
        video: faker.lorem.word()
      })
        recetasList.push(receta);
    }
  }
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne debe retornar una receta por su id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre)
    expect(receta.descripcion).toEqual(storedReceta.descripcion)
    expect(receta.foto).toEqual(storedReceta.foto)
    expect(receta.preparacion).toEqual(storedReceta.preparacion)
    expect(receta.video).toEqual(storedReceta.video)
  });

  it('findOne debe retornar excepcion para una receta invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe")
  });

  it('create debe retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.word(),
      video: faker.lorem.word(),
      productos: [],
      cultura: []
    }

    const nuevaReceta: RecetaEntity = await service.create(receta);
    expect(nuevaReceta).not.toBeNull();
 
    const storedReceta: RecetaEntity = await repository.findOne({where: {id: nuevaReceta.id}})
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(nuevaReceta.nombre)
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.descripcion).toEqual(nuevaReceta.descripcion)
    expect(storedReceta.foto).toEqual(nuevaReceta.foto)
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.preparacion).toEqual(nuevaReceta.preparacion)
    expect(storedReceta.video).toEqual(nuevaReceta.video)
  });

  it('update debe modificar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = "Nombre a modificar";
    receta.descripcion = "Descripcion de la receta a modificar";
    receta.foto = "Foto de la receta a modificar";
     const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();
     const storedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } })
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre)
    expect(storedReceta.descripcion).toEqual(receta.descripcion)
    expect(storedReceta.foto).toEqual(receta.foto)
    expect(storedReceta.preparacion).toEqual(receta.preparacion)
    expect(storedReceta.video).toEqual(receta.video)
  });

  it('update debe retornar una excepcion por una receta invalida', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta, nombre: "Nuevo nombre", descripcion: "Nueva descripcion de una receta", foto: "Nueva descripcion de una receta", preparacion:  "Nueva descripcion de una receta", video: "Nueva descripcion de una receta" 
    }
    await expect(() => service.update("0", receta)).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe")
  });

  it('delete debe remover una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
     const deletedReceta: RecetaEntity = await repository.findOne({ where: { id: receta.id } })
    expect(deletedReceta).toBeNull();
  });

  it('delete debe retornar una excepcion por una receta invalida', async () => {
    let receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La receta con el identificador especificado no existe")
  }); 


});
