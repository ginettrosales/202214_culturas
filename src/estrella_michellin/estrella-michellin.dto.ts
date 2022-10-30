
import { IsNotEmpty,  IsString} from "class-validator";
import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class EstrellaMichellinDto {

   @Field()
   @IsString()
   @IsNotEmpty()
   fechaConsecucion: string;

}