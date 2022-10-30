import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {Column,Entity,PrimaryGeneratedColumn,OneToMany,ManyToOne,} from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CiudadEntity {
  
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string
  
  @Field(type=> [PaisEntity])
  @ManyToOne(() => PaisEntity, (pais) => pais.ciudades)
  pais: PaisEntity;

  @Field(type=> [RestauranteEntity])
  @OneToMany(() => RestauranteEntity, restaurante => restaurante.ciudad)
  restaurantes: RestauranteEntity[];
}
