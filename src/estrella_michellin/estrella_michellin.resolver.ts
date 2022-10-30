import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { EstrellaMichellinEntity } from './estrella_michellin.entity';
import { EstrellaMichellinService } from './estrella_michellin.service';
import { plainToInstance } from 'class-transformer';
import { EstrellaMichellinDto } from './estrella-michellin.dto';

@Resolver()
export class EstrellaMichellinResolver {

    constructor(private estrellaMichellinService: EstrellaMichellinService) {}

    @Query(() => [EstrellaMichellinEntity])
    museums(): Promise<EstrellaMichellinEntity[]> {
        return this.estrellaMichellinService.findAll();
    }

    @Query(() => EstrellaMichellinEntity)
    museum(@Args('id') id: string): Promise<EstrellaMichellinEntity> {
        return this.estrellaMichellinService.findOne(id);
    }

  
   @Mutation(() => EstrellaMichellinEntity)
   updateMuseum(@Args('id') id: string, @Args('estrellaMichellin') estrellaMichellinDto: EstrellaMichellinDto): Promise<EstrellaMichellinEntity> {
       const estrella = plainToInstance(EstrellaMichellinEntity, estrellaMichellinDto);
       return this.estrellaMichellinService.update(id, estrella);
   }

  

}
