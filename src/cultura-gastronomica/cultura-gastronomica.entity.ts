import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;

    @Field(type => ProductoEntity)
    @ManyToMany(()=> ProductoEntity, producto => producto.culturas)
    @JoinTable()
    productos: ProductoEntity[];

    @Field(type => RecetaEntity)
    @ManyToMany(()=> RecetaEntity, receta => receta.cultura)
    recetas: RecetaEntity[];

    @Field(type=> [RestauranteEntity])
    @ManyToMany(()=> RestauranteEntity, restaurante => restaurante.culturas)
    restaurantes: RestauranteEntity[];

    @Field(type => PaisEntity)
    @ManyToMany(() => PaisEntity, pais => pais.culturas)
    paises: PaisEntity[];
}    