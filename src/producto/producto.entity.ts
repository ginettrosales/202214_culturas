import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';

export enum Categoria {
    CONDIMENTOS = "Condimentos",
    HORTALIZAS = "Hortalizas",
    VEGETALES = "Vegetales",
    CARNICOS = "Cárnicos",
    OTROS = "Otros"
}

@ObjectType()
@Entity()
export class ProductoEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column({
        type: 'simple-enum',
        enum: Categoria
      })
      categoria: Categoria

    @Field()
    @Column()
    descripcion: string;

    @Field()
    @Column()
    historia: string;

    @ManyToMany(()=> CulturaGastronomicaEntity, cultura => cultura.productos)
    culturas: CulturaGastronomicaEntity[];

    @Field(type => RecetaEntity)
    @ManyToMany(()=> RecetaEntity, receta => receta.productos)
    recetas: RecetaEntity[];
}
