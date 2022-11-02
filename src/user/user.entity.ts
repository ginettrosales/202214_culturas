import {Column,Entity,PrimaryGeneratedColumn,OneToMany,ManyToOne,} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

export class UserEntity {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 username: string;
 
 @Column()
 password: string;

 @Column()
 roles: string[]
}
