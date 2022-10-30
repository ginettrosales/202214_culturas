import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Categoria, ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();
    
    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });
  
  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
      const producto: ProductoEntity = await repository.save({
        nombre: faker.lorem.word(),
        categoria: Categoria.CONDIMENTOS,
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()})
        productosList.push(producto);
  }
}

  it('el servicio debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne debe retornar un producto por su id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.categoria).toEqual(storedProducto.categoria)
    expect(producto.descripcion).toEqual(storedProducto.descripcion)
    expect(producto.historia).toEqual(storedProducto.historia)
  });

  it('findOne debe retornar excepcion para un producto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe")
  });

  it('create debe retornar un nuevo producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
      culturas: [],
      recetas: []
    }

    const nuevoProducto: ProductoEntity = await service.create(producto);
    expect(nuevoProducto).not.toBeNull();
 
    const storedProducto: ProductoEntity = await repository.findOne({where: {id: nuevoProducto.id}})
    expect(storedProducto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.categoria).toEqual(storedProducto.categoria)
    expect(producto.descripcion).toEqual(storedProducto.descripcion)
    expect(producto.historia).toEqual(storedProducto.historia)
  });

  it('update debe modificar un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "Nuevo nombre";
    producto.categoria = Categoria.CARNICOS;
    producto.descripcion = "Nueva descripcion de un producto";
    producto.historia = "Nueva historia de un producto"
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
    expect(storedProducto.categoria).toEqual(producto.categoria)
    expect(storedProducto.descripcion).toEqual(producto.descripcion)
    expect(storedProducto.historia).toEqual(producto.historia)
  });

  it('update debe retornar una excepcion por un producto invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "Nuevo nombre", descripcion: "Nueva descripcion de un producto"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe")
  });

  it('delete debe remover un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
     const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete debe retornar una excepcion por un producto invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe")
  });  
});
