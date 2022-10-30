import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Categoria, ProductoEntity } from '../producto/producto.entity';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { CACHE_MANAGER } from '@nestjs/common';

const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
}

describe('CulturaGastronomicaProductoService', () => {
  let service: CulturaGastronomicaProductoService;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let cultura: CulturaGastronomicaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaProductoService, { provide: CACHE_MANAGER, useValue:mockCacheManager}],
    }).compile();

    service = module.get<CulturaGastronomicaProductoService>(CulturaGastronomicaProductoService);
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaRepository.clear();
    
    productosList = [];
    for(let i = 0; i < 5; i++){
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.lorem.word(),
        categoria: Categoria.CONDIMENTOS,
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()
      })
      productosList.push(producto);
    }
 
    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      productos: productosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoToCulturaGastronomica debe agregar un producto a una cultura gastronómica', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });
 
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    })
 
    const result: CulturaGastronomicaEntity = await service.addProductoToCulturaGastronomica(nuevaCultura.id, nuevoProducto.id);
   
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(nuevoProducto.nombre)
    expect(result.productos[0].categoria).toBe(nuevoProducto.categoria)
    expect(result.productos[0].descripcion).toBe(nuevoProducto.descripcion)
    expect(result.productos[0].historia).toBe(nuevoProducto.historia)
  });

  it('addProductoToCulturaGastronomica debe retornar un error por producto invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    })
 
    await expect(() => service.addProductoToCulturaGastronomica(nuevaCultura.id, "0")).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe");
  });
  
  it('addProductoToCulturaGastronomica debe retornar un error por producto invalido', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });
 
    await expect(() => service.addProductoToCulturaGastronomica("0", nuevoProducto.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('findProductoCulturaGastronomicaIdProductoId retorna un producto invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity = await service.findProductoCulturaGastronomicaIdProductoId(cultura.id, producto.id,)
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.categoria).toBe(producto.categoria);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
    expect(storedProducto.historia).toBe(producto.historia);
  });

  it('findProductosByCulturaGastronomicaId debe retornar los productos asociados a una cultura gastronomica', async ()=>{
    const productos: ProductoEntity[] = await service.findProductosByCulturaGastronomicaId(cultura.id);
    expect(productos.length).toBe(5)
  });

  it('findProductosByCulturaGastronomicaId debe retornar una execpcion por una cultura gastronomica invalida', async () => {
    await expect(()=> service.findProductosByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('associateProductosCulturaGastronomica debe actualizar la lista de producto de una cultura gastronomica', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });
 
    const updatedCultura: CulturaGastronomicaEntity = await service.associateProductosCulturaGastronomica(cultura.id, [nuevoProducto]);
    expect(updatedCultura.productos.length).toBe(1);
    expect(updatedCultura.productos[0].nombre).toBe(nuevoProducto.nombre);
    expect(updatedCultura.productos[0].categoria).toBe(nuevoProducto.categoria);
    expect(updatedCultura.productos[0].descripcion).toBe(nuevoProducto.descripcion);
    expect(updatedCultura.productos[0].historia).toBe(nuevoProducto.historia);
  });
  
  it('associateProductosCulturaGastronomica debe retornar error por una cultura invalida', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateProductosCulturaGastronomica("0", [nuevoProducto])).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('associateProductosCulturaGastronomica debe retornar una execepcion por un producto invalido', async () => {
    const nuevoProducto: ProductoEntity = productosList[0];
    nuevoProducto.id = "0";
 
    await expect(()=> service.associateProductosCulturaGastronomica(cultura.id, [nuevoProducto])).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe");
  });

  it('deleteProductoCulturaGastronomica debe remover un producto de una cultura gastronomica', async () => {
    const producto: ProductoEntity = productosList[0];
   
    await service.deleteProductoCulturaGastronomica(cultura.id, producto.id);
 
    const storedCultura: CulturaGastronomicaEntity = await culturaRepository.findOne({where: {id: cultura.id}, relations: ["productos", "recetas"]});
    const deletedProducto: ProductoEntity = storedCultura.productos.find(a => a.id === producto.id);
 
    expect(deletedProducto).toBeUndefined();
  });

  it('deleteProductoCulturaGastronomica debe retornar una excepcion por un producto invalido', async () => {
    await expect(()=> service.deleteProductoCulturaGastronomica(cultura.id, "0")).rejects.toHaveProperty("message", "El producto con el identificador especificado no existe");
  });

  it('deleteProductoCulturaGastronomica debe retornar una excepcion por una cultura gastronomica invalida', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteProductoCulturaGastronomica("0", producto.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el identificador especificado no existe");
  });

  it('deleteProductoCulturaGastronomica devuelve una excepcion por un producto que no esta relacionado a una cultura gastronomica', async () => {
    const nuevoProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.word(),
      categoria: Categoria.CONDIMENTOS,
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteProductoCulturaGastronomica(cultura.id, nuevoProducto.id)).rejects.toHaveProperty("message", "El producto con el identificador especificado no esta asociado a la cultura gastronómica");
  });
});
