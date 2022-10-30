import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors'
import { ProductoEntity } from './producto.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductoService {
    cacheKey: string = "productos";
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<ProductoEntity[]>{
        const cached: ProductoEntity[] = await this.cacheManager.get<ProductoEntity[]>(this.cacheKey);
        if(!cached){
           const productos: ProductoEntity[] = await this.productoRepository.find({relations: ["culturas", "recetas"]})
           await this.cacheManager.set(this.cacheKey, productos);
           return productos;
       }
       return cached;
    }

    async findOne(id: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["culturas", "recetas"] } );
        if (!producto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND);
   
        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        return await this.productoRepository.save(producto);
    }

    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const persistedProducto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!persistedProducto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND);
        
        return await this.productoRepository.save({...persistedProducto, ...producto});
    }

    async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!producto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND);
     
        await this.productoRepository.remove(producto);
    }
}