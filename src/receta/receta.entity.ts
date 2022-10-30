/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;
    
    @Field()
    @Column()
    descripcion: string;

    @Field()
    @Column()
    foto: string;
    
    @Field()
    @Column()
    preparacion: string;
    
    @Field()
    @Column()
    video: string;
    
    @Field(type => CulturaGastronomicaEntity)
    @ManyToMany(() => CulturaGastronomicaEntity, cultura => cultura.recetas)
    @JoinTable()
    cultura: CulturaGastronomicaEntity[];

    @Field(type => [ProductoEntity])
    @ManyToMany(() => ProductoEntity, producto => producto.recetas)
    @JoinTable()
    productos: ProductoEntity[];
}
