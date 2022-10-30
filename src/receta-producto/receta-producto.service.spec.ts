import { Test, TestingModule } from '@nestjs/testing';
import { RecetaEntity } from '../receta/receta.entity';
import { Categoria, ProductoEntity } from '../producto/producto.entity';
import { RecetaProductoService } from './receta-producto.service';
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

describe('RecetaProductoService', () => {
  let service: RecetaProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let receta: RecetaEntity;
  let productoList : ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaProductoService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<RecetaProductoService>(RecetaProductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    recetaRepository.clear();
    
 
    productoList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          nombre: faker.lorem.word(),
          categoria: Categoria.CONDIMENTOS,
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
        })
        productoList.push(producto);
    }
 
    receta = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.word(),
      video: faker.lorem.word(),
      productos: productoList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('addProductoReceta should add an producto to a receta', async () => {
    const nuevoReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word()
    });
    
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
 
    const result: RecetaEntity = await service.addProductoReceta(nuevoReceta.id, newProducto.id);
   
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
    expect(result.productos[0].categoria).toBe(newProducto.categoria)
    expect(result.productos[0].descripcion).toBe(newProducto.descripcion)
    expect(result.productos[0].historia).toBe(newProducto.historia) 
   
  });

  it('addProductoReceta should thrown exception for an invalid producto', async () => {
    const newreceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.paragraph(),
      foto: faker.lorem.word(),
      preparacion: faker.lorem.paragraph(),
      video: faker.lorem.word(),
    })
 
    await expect(() => service.addProductoReceta(newreceta.id, "0")).rejects.toHaveProperty("message", "El producto con el id especificado no existe");
  });

  it('addProductoReceta should throw an exception for an invalid receta', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
    await expect(() => service.addProductoReceta("0", newproducto.id)).rejects.toHaveProperty("message", "La receta con el id especificado no existe");
  });

  it('findProductoByRecetaIdProductoId should return producto by receta', async () => {
    const producto: ProductoEntity = productoList[0];
    const storedproducto: ProductoEntity = await service.findProductoByRecetaIdProductoId(receta.id, producto.id, )
    expect(storedproducto).not.toBeNull();
    expect(storedproducto.nombre).toBe(producto.nombre);
    expect(storedproducto.categoria).toBe(producto.categoria);
    expect(storedproducto.descripcion).toBe(producto.descripcion);
    expect(storedproducto.historia).toBe(producto.historia);
   
  });

  it('findProductoByRecetaIdProductoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findProductoByRecetaIdProductoId(receta.id, "0")).rejects.toHaveProperty("message", "El producto con el id especificado no existe");
  });

  it('findProductoByRecetaIdProductoId should throw an exception for an invalid receta', async () => {
    const producto: ProductoEntity = productoList[0];
    await expect(()=> service.findProductoByRecetaIdProductoId("0", producto.id)).rejects.toHaveProperty("message", "La receta con el id especificado no existe");
  });

  it('findProductoByRecetaIdProductoId should throw an exception for an producto not associated to the receta', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
    await expect(()=> service.findProductoByRecetaIdProductoId(receta.id, newproducto.id)).rejects.toHaveProperty("message", "El producto con el id especificado no esta asociada con la receta");
  });

  it('findProductosByRecetaId should return productos by receta', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByRecetaId(receta.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByRecetaId should throw an exception for an invalid receta', async () => {
    await expect(()=> service.findProductosByRecetaId("0")).rejects.toHaveProperty("message", "La receta con el id especificado no existe");
  });
 
  it('associateProductosReceta should update productos list for a receta', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
    const updatedreceta: RecetaEntity = await service.associateProductosReceta(receta.id, [newproducto]);
    expect(updatedreceta.productos.length).toBe(1);
 
    expect(updatedreceta.productos[0].nombre).toBe(newproducto.nombre);
   
  });

  it('associateProductosReceta should throw an exception for an invalid receta', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
    await expect(()=> service.associateProductosReceta("0", [newproducto])).rejects.toHaveProperty("message", "La receta con el id especificado no existe");
  });

  it('associateProductosReceta should throw an exception for an invalid producto', async () => {
    const newproducto: ProductoEntity = productoList[0];
    newproducto.id = "0";
 
    await expect(()=> service.associateProductosReceta(receta.id, [newproducto])).rejects.toHaveProperty("message", "El producto con el id especificado no existe");
  });

  it('deleteproductoToreceta should remove an producto from a receta', async () => {
    const producto: ProductoEntity = productoList[0];
   
    await service.deleteProductoReceta(receta.id, producto.id);
 
    const storedreceta: RecetaEntity = await recetaRepository.findOne({where: {id: `${receta.id}`}, relations: ["productos"]});
    const deletedproducto: ProductoEntity = storedreceta.productos.find(a => a.id === producto.id);
 
    expect(deletedproducto).toBeUndefined();
 
  });

  it('deleteproductoToreceta should thrown an exception for an invalid producto', async () => {
    await expect(()=> service.deleteProductoReceta(receta.id, "0")).rejects.toHaveProperty("message", "El producto con el id especificado no existe");
  });

  it('deleteproductoToreceta should thrown an exception for an invalid receta', async () => {
    const producto: ProductoEntity = productoList[0];
    await expect(()=> service.deleteProductoReceta("0", producto.id)).rejects.toHaveProperty("message", "La receta con el id especificado no existe");
  });

  it('deleteproductoToreceta should thrown an exception for an non asocciated producto', async () => {
    const newproducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    });
 
    await expect(()=> service.deleteProductoReceta(receta.id, newproducto.id)).rejects.toHaveProperty("message", "El producto con el id especificado no esta asociada con la receta");
  });
   
});
