import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaProductoService {

  cacheKey: string = "cultura-gastronomica-productos";

    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,
    
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async addProductoToCulturaGastronomica(culturaId: string, productoId: string): Promise<CulturaGastronomicaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND);
      
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]})
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND);
    
        cultura.productos = [...cultura.productos, producto];
        return await this.culturaRepository.save(cultura);
    }

    async findProductoCulturaGastronomicaIdProductoId(culturaId: string, productoId: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND)
       
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
   
        const culturaProducto: ProductoEntity = cultura.productos.find(e => e.id === producto.id);
        if (!culturaProducto)
          throw new BusinessLogicException("El producto con el identificador especificado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
          
        return culturaProducto;
    }

    async findProductosByCulturaGastronomicaId(culturaId: string): Promise<ProductoEntity[]> {

      const cached: ProductoEntity[] = await this.cacheManager.get<ProductoEntity[]>(this.cacheKey);
      
        if(!cached){
          
          const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
          if (!cultura){
            throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
          }
          await this.cacheManager.set(this.cacheKey, cultura.productos);
          return cultura.productos;
        }
        
        return cached;
    }

    async associateProductosCulturaGastronomica(productoId: string, productos: ProductoEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: productoId}, relations: ["productos", "recetas"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
          if (!producto)
            throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND)
        }
    
        cultura.productos = productos;
        return await this.culturaRepository.save(cultura);
      }
    
    async deleteProductoCulturaGastronomica(culturaId: string, productoId: string){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("El producto con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos", "recetas"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el identificador especificado no existe", BusinessError.NOT_FOUND)
    
        const culturaProducto: ProductoEntity = cultura.productos.find(e => e.id === producto.id);
    
        if (!culturaProducto)
            throw new BusinessLogicException("El producto con el identificador especificado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.productos = cultura.productos.filter(e => e.id !== productoId);
        await this.culturaRepository.save(cultura);
    }
}
