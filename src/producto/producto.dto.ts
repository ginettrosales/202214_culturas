import { Field, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsString, IsEnum} from 'class-validator';

export enum Categoria {
    CONDIMENTOS = "Condimentos",
    HORTALIZAS = "Hortalizas",
    VEGETALES = "Vegatles",
    CARNICOS = "Cárnicos",
    OTROS = "Otros"
}

@InputType()
export class ProductoDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
   
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
    
    @Field()
    @IsEnum(Categoria)
    public categoria: Categoria;
    
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly historia: string;
}

