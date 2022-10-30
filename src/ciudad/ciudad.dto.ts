import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CiudadDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
}
