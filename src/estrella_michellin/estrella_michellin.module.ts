import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstrellaMichellinEntity } from './estrella_michellin.entity';
import { EstrellaMichellinService } from './estrella_michellin.service';
import { EstrellaMichellinController } from './estrella_michellin.controller';
import { EstrellaMichellinResolver } from './estrella_michellin.resolver';

@Module({
  imports:[TypeOrmModule.forFeature([EstrellaMichellinEntity])],
  providers: [EstrellaMichellinService, EstrellaMichellinResolver],
  controllers: [EstrellaMichellinController]
})
export class EstrellaMichellinModule {}
