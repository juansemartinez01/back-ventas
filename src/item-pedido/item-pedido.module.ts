import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemPedido } from './item-pedido.entity';
import { ItemPedidoService } from './item-pedido.service';
import { ItemPedidoController } from './item-pedido.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ItemPedido])],
  providers: [ItemPedidoService],
  controllers: [ItemPedidoController],
})
export class ItemPedidoModule {}