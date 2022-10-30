import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { RecetaEntity } from '../receta/receta.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()

export class RecetaProductoService {
    
    cacheKey: string = "recetas_productos";
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}
 
    async addProductoReceta(recetaId: string, productoId: string): Promise<RecetaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el id especificado no existe", BusinessError.NOT_FOUND);
      
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["productos"]})
        if (!receta)
          throw new BusinessLogicException("La receta con el id especificado no existe", BusinessError.NOT_FOUND);

        receta.productos = [...receta.productos, producto];
        return await this.recetaRepository.save(receta);
      }
    
    async findProductoByRecetaIdProductoId(recetaId: string, productoId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el id especificado no existe", BusinessError.NOT_FOUND)
       
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["productos"]});
        if (!receta)
          throw new BusinessLogicException("La receta con el id especificado no existe", BusinessError.NOT_FOUND)
   
        const recetaproducto: ProductoEntity = receta.productos.find(e => e.id === producto.id);
   
        if (!recetaproducto)
          throw new BusinessLogicException("El producto con el id especificado no esta asociada con la receta", BusinessError.PRECONDITION_FAILED)
   
        return recetaproducto;
    }
    
    async findProductosByRecetaId(recetaId: string): Promise<ProductoEntity[]> {
      const cached: ProductoEntity[] = await this.cacheManager.get<ProductoEntity[]>(this.cacheKey);
      
      if(!cached){

        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["productos"]});
        if (!receta)
          throw new BusinessLogicException("La receta con el id especificado no existe", BusinessError.NOT_FOUND)
        await this.cacheManager.set(this.cacheKey, receta.productos);
        return receta.productos;
      }
      return cached;      
    }
    
    async associateProductosReceta(recetaId: string, productos: ProductoEntity[]): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["productos"]});
    
        if (!receta)
          throw new BusinessLogicException("La receta con el id especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
          if (!producto)
            throw new BusinessLogicException("El producto con el id especificado no existe", BusinessError.NOT_FOUND)
        }
    
        receta.productos = productos;
        return await this.recetaRepository.save(receta);
      }
    
    async deleteProductoReceta(recetaId: string, productoId: string){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["productos"]});
        if (!receta)
          throw new BusinessLogicException("La receta con el id especificado no existe", BusinessError.NOT_FOUND)
    
        const recetaproducto: ProductoEntity = receta.productos.find(e => e.id === producto.id);
    
        if (!recetaproducto)
            throw new BusinessLogicException("El producto con el id especificado no esta asociada con la receta", BusinessError.PRECONDITION_FAILED)
 
        receta.productos = receta.productos.filter(e => e.id !== productoId);
        await this.recetaRepository.save(receta);
    }  
}
