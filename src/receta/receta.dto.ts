import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecetaDto {

 @Field()
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly foto: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly preparacion: string;
 
 @Field()
 @IsUrl()
 @IsNotEmpty()
 readonly video: string;
} 
