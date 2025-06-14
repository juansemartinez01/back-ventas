import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ItemPedido } from 'src/item-pedido/item-pedido.entity';
import { StockActual } from 'src/stock-actual/stock-actual.entity';
import { CreatePedidoWithItemsDto } from './dto/create-pedido-with-items.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { PedidoManual } from 'src/pedido-manual/pedido-manual.entity';
import { Producto } from 'src/producto/producto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,

    @InjectRepository(ItemPedido)
    private readonly itemRepo: Repository<ItemPedido>,

    @InjectRepository(StockActual)
    private readonly stockRepo: Repository<StockActual>,

    private readonly dataSource: DataSource,

    private readonly usuarioService: UsuarioService,
  ) {}

  findAll(): Promise<Pedido[]> {
    return this.pedidoRepo.find();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepo.findOneBy({ id });
    if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);
    return pedido;
  }

  create(dto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidoRepo.create(dto);
    return this.pedidoRepo.save(pedido);
  }

  async update(id: number, dto: UpdatePedidoDto): Promise<Pedido> {
  const pedido = await this.findOne(id);

  if (dto.clienteId !== undefined)
    pedido.cliente = { id: dto.clienteId } as any;

  if (dto.usuarioId !== undefined)
    pedido.usuario = { id: dto.usuarioId } as any;

  if (dto.armadorId !== undefined)
    pedido.armador = { id: dto.armadorId } as any;

  if (dto.entregadorId !== undefined)
    pedido.entregador = { id: dto.entregadorId } as any;

  if (dto.fechaHora !== undefined)
    pedido.fechaHora = new Date(dto.fechaHora);

  if (dto.canal !== undefined)
    pedido.canal = dto.canal;

  if (dto.estado !== undefined)
    pedido.estado = dto.estado;

  if (dto.estadoPago !== undefined)
    pedido.estadoPago = dto.estadoPago;

  if (dto.nota !== undefined)
  pedido.nota = dto.nota;

  return this.pedidoRepo.save(pedido);
}


  async remove(id: number): Promise<void> {
    const res = await this.pedidoRepo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`Pedido ${id} no encontrado`);
  }

  async createWithItems(dto: CreatePedidoWithItemsDto): Promise<Pedido> {
    return this.dataSource.transaction(async manager => {
      // 1) Creo el pedido
      const pedido = manager.getRepository(Pedido).create({
      cliente: dto.clienteId ? { id: dto.clienteId } : null,
      usuario: { id: dto.usuarioId },
      fechaHora: new Date(dto.fechaHora),
      canal: dto.canal,
      estado: dto.estado,
      armador: dto.armadorId ? { id: dto.armadorId } : null,
      entregador: dto.entregadorId ? { id: dto.entregadorId } : null,
      estadoPago: dto.estadoPago,
      nota: dto.nota,
    } as Pedido);

      const savedPedido = await manager.getRepository(Pedido).save(pedido);

      // 2) Por cada ítem: lo guardo y actualizo stock
      for (const it of dto.items) {
        // 2.1) Crear línea de pedido
        const item = manager.getRepository(ItemPedido).create({
          pedido:         savedPedido,
          producto:       { id: it.productoId },
          cantidad:       it.cantidad,
          precio_unitario: it.precio_unitario,
          comentario:     it.comentario,
        });
        await manager.getRepository(ItemPedido).save(item);

        // 2.2) Obtener stock disponible (FIFO por fecha)
        const stock = await manager
          .getRepository(StockActual)
          .createQueryBuilder('stock')
          .where('stock.producto_id = :productoId', { productoId: it.productoId })
          .andWhere('stock.cantidad >= :cantidad',    { cantidad: it.cantidad })
          .orderBy('stock.last_updated', 'ASC')
          .getOne();

        if (!stock) {
          const producto = await manager.getRepository(Producto).findOneBy({ id: it.productoId });
          const stockReal = await manager
            .getRepository(StockActual)
            .createQueryBuilder('stock')
            .select('SUM(stock.cantidad)', 'cantidad')
            .where('stock.producto_id = :productoId', { productoId: it.productoId })
            .getRawOne();

          const cantidadDisponible = stockReal?.cantidad ?? 0;
          throw new NotFoundException(
            `No hay stock suficiente para el producto ${producto?.nombre ?? it.productoId}. El stock actual es ${cantidadDisponible}.`
          );
        }


        // 2.3) Descontar y guardar
        stock.cantidad -= it.cantidad;
        await manager.getRepository(StockActual).save(stock);
      }
      // 3) Actualizar última compra del usuario
      await this.usuarioService.update(dto.usuarioId, {
      ultimaCompra: new Date()
      });

      return savedPedido;
    });
  }

  async cancelarPedido(pedidoId: number): Promise<Pedido> {
  return this.dataSource.transaction(async manager => {
    // 1) Traer el pedido con sus ítems
    const pedido = await manager.getRepository(Pedido).findOne({
      where: { id: pedidoId },
      relations: ['items', 'items.producto'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido ${pedidoId} no encontrado`);
    }

    if (pedido.estado === 'Cancelado') {
      throw new BadRequestException(`El pedido ${pedidoId} ya fue cancelado`);
    }

    // 2) Revertir stock por cada ítem
    for (const item of pedido.items) {
      // Buscar el stock actual
      const stock = await manager.getRepository(StockActual).findOne({
        where: { producto: { id: item.producto.id } }
      });

      if (!stock) {
        throw new NotFoundException(
          `No se encontró stock para el producto ${item.producto.id}`
        );
      }

      // Sumar la cantidad nuevamente
      stock.cantidad += item.cantidad;
      await manager.getRepository(StockActual).save(stock);
    }

    // 3) Marcar pedido como cancelado
    pedido.estado = 'Cancelado';
    await manager.getRepository(Pedido).save(pedido);

    return pedido;
  });
}

  async obtenerTodosConNombreClienteManual() {
  // 1. Traigo todos los pedidos con sus relaciones normales
  const pedidos = await this.pedidoRepo.find({
    relations: ['cliente', 'usuario', 'armador', 'entregador'],
    order: { id: 'ASC' },
  });

  // 2. Traigo los pedidos_manuales con sus campos reales de BD
  const pedidosManualesRaw = await this.dataSource
    .getRepository(PedidoManual)
    .createQueryBuilder('pm')
    .select([
      'pm.pedido_id AS pedido_id',
      'pm.nombre_cliente AS nombre_cliente',
    ])
    .getRawMany();

  // 3. Indexo los nombre_cliente por pedido_id
  const nombreManualPorPedidoId = new Map<number, string>();
  for (const pm of pedidosManualesRaw) {
    if (pm.pedido_id !== null && pm.nombre_cliente !== null) {
      nombreManualPorPedidoId.set(Number(pm.pedido_id), pm.nombre_cliente);
    }
  }

  // 4. Devuelvo los pedidos agregando el campo nombreClienteManual si aplica
  return pedidos.map(pedido => ({
    ...pedido,
    nombreClienteManual: nombreManualPorPedidoId.get(pedido.id) ?? null,
  }));
  }




}