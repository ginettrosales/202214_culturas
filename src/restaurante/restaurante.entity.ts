import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany ,JoinTable, ManyToOne} from 'typeorm';
import { EstrellaMichellinEntity } from '../estrella_michellin/estrella_michellin.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Field()
    @Column()
    nombre: string;
    
    @Field(type=> [EstrellaMichellinEntity])
    @OneToMany(() => EstrellaMichellinEntity, estrellaMichellin => estrellaMichellin.restaurante)
    estrellasMichellin: EstrellaMichellinEntity[];

    @Field(type=> [CulturaGastronomicaEntity])
    @ManyToMany(() => CulturaGastronomicaEntity, cultura => cultura.restaurantes)
    @JoinTable()
    culturas: CulturaGastronomicaEntity[];

    @Field(type => CiudadEntity)
    @ManyToOne(() => CiudadEntity, ciudad => ciudad.restaurantes)
    ciudad: CiudadEntity;
}
