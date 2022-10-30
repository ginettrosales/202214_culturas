import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(type=> [CiudadEntity])
  @OneToMany(() => CiudadEntity, ciudad => ciudad.pais)
  ciudades: CiudadEntity[];

  @Field(type=> [CulturaGastronomicaEntity])
  @ManyToMany(() => CulturaGastronomicaEntity, cultura => cultura.paises)
  @JoinTable()
  culturas: CulturaGastronomicaEntity[];
}
