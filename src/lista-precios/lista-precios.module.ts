import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaPrecios } from './lista-precios.entity';
import { ListaPreciosService } from './lista-precios.service';
import { ListaPreciosController } from './lista-precios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ListaPrecios])],
  providers: [ListaPreciosService],
  controllers: [ListaPreciosController],
})
export class ListaPreciosModule {}