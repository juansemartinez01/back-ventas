import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { ItemPedidoService } from 'src/item-pedido/item-pedido.service';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido]),
  TypeOrmModule.forFeature([ItemPedido,PrecioProductoLista]),
],
  providers: [PedidoService,ItemPedidoService],
  controllers: [PedidoController],
})
export class PedidoModule {}
