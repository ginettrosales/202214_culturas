import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaEntity } from 'src/cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';

@Resolver()
export class CulturaGastronomicaProductoResolver {

    constructor(private culturaGastronomicaProductoService: CulturaGastronomicaProductoService) {}

    @Query(() => [ProductoEntity])
    findProductosByCulturaGastronomicaId(@Args('id_cultura') id_cultura: string): Promise<ProductoEntity[]> {
        return this.culturaGastronomicaProductoService.findProductosByCulturaGastronomicaId(id_cultura);
    }

    @Query(() => ProductoEntity)
    findProductoCulturaGastronomicaIdProductoId(@Args('id_cultura') id_cultura: string,@Args('id_producto') id_producto: string ): Promise<ProductoEntity> {
        return this.culturaGastronomicaProductoService.findProductoCulturaGastronomicaIdProductoId(id_cultura,id_producto);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    addProductoToCulturaGastronomica(@Args('id_cultura') id_cultura: string,@Args('id_producto') id_producto: string): Promise<CulturaGastronomicaEntity> {
       return this.culturaGastronomicaProductoService.addProductoToCulturaGastronomica(id_cultura, id_producto);
   }

    @Mutation(() => CulturaGastronomicaEntity)
    associateProductosCulturaGastronomica(@Args({ name: 'productos', type: () => [ProductoDto] }) productoDto: ProductoDto[], @Args('id_cultura') id_cultura: string): Promise<CulturaGastronomicaEntity> {
       const productos = plainToInstance(ProductoEntity, productoDto);
       return this.culturaGastronomicaProductoService.associateProductosCulturaGastronomica(id_cultura, productos);
   }

    @Mutation(() => String)
    deleteProductoCulturaGastronomica(@Args('id_cultura') id_cultura: string, @Args('id_producto') id_producto: string) {
       this.culturaGastronomicaProductoService.deleteProductoCulturaGastronomica(id_cultura, id_producto);
       return id_producto;
   }
}
