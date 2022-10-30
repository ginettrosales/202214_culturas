/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn , ManyToOne} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class EstrellaMichellinEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Field()
    @Column({ type: 'date' })
    fechaConsecucion: string;

    @Field(type => RestauranteEntity)
    @ManyToOne(() => RestauranteEntity, restaurante => restaurante.estrellasMichellin)
    restaurante: RestauranteEntity;
}
