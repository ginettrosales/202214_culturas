import { Body, Controller,  Get,  Param,  Put, UseInterceptors , UseGuards} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { EstrellaMichellinService } from './estrella_michellin.service';
import { EstrellaMichellinDto } from './estrella-michellin.dto';
import { EstrellaMichellinEntity } from './estrella_michellin.entity';
import { Role } from "../user/entities/role.enum";
import { Roles } from "../user/roles.decorator";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('estrellasmichellin')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard)
export class EstrellaMichellinController {

    constructor(private readonly estrellaMichellinService: EstrellaMichellinService) {}

    @Get()
    @Roles(Role.LECTURA)
    async findAll() {
      return await this.estrellaMichellinService.findAll();
    }

    @Get(':estrellaId')
    @Roles(Role.LECTURA)
    async findOne(@Param('estrellaId') estrellaId: string) {
      return await this.estrellaMichellinService.findOne(estrellaId);
    }

    @Put(':estrellaId')
    @Roles(Role.ESCRITURA)
  async update(@Param('estrellaId') estrellaId: string, @Body() estrellaMichellinDto: EstrellaMichellinDto) {
    const estrella: EstrellaMichellinEntity = plainToInstance(EstrellaMichellinEntity, estrellaMichellinDto);
    return await this.estrellaMichellinService.update(estrellaId, estrella);
  }

}
