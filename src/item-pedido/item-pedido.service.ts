import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { Pedido } from 'src/pedido/pedido.entity';
import { Producto } from 'src/producto/producto.entity';

@Injectable()
export class ItemPedidoService {
  constructor(
    @InjectRepository(ItemPedido)
    private readonly repo: Repository<ItemPedido>,
  ) {}

  findAll(): Promise<ItemPedido[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ItemPedido> {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`ItemPedido ${id} no encontrado`);
    return item;
  }

  create(dto: CreateItemPedidoDto): Promise<ItemPedido> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateItemPedidoDto): Promise<ItemPedido> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`ItemPedido ${id} no encontrado`);
  }

  /**
   * Devuelve un objeto con:
   *  - pedido: toda la entidád Pedido (con sus relaciones cliente/usuario…)
   *  - productos: array de productos + cantidad + precio_unitario
   */
  async findGroupedByPedidoId(pedidoId: number): Promise<{
    pedido: Pedido;
    productos: Array<Producto & { cantidad: number; precio_unitario: string }>;
  }> {
    const items = await this.repo.find({
      where: { pedidoId },
      relations: [
        'pedido',
        'pedido.cliente',
        'pedido.usuario',
        'producto',
        'producto.unidad',
        'producto.tipoProducto',
      ],
    });

    if (items.length === 0) {
      throw new NotFoundException(`No se encontraron items para el pedido ${pedidoId}`);
    }

    // Sólo una vez tomamos el pedido completo
    const { pedido } = items[0];

    // dentro de tu método en el service, asumiendo que “items” está cargado con todas las relaciones:
const productos = items.map(item => {
  const p = item.producto;

  return {
    id: p.id,
    nombre: p.nombre,
    precio_base: p.precio_base,
    unidadId: p.unidadId,
    unidad: p.unidad,
    tipoProductoId: p.tipoProductoId,
    tipoProducto: p.tipoProducto,
    descripcion: p.descripcion,
    vacio: p.vacio,
    oferta: p.oferta,
    precio_oferta: p.precio_oferta,
    activo: p.activo,
    imagen: p.imagen,
    precioVacio: p.precioVacio,
    created_at: p.created_at,
    updated_at: p.updated_at,
    id_interno: p.id_interno,

    // campos propios del item
    cantidad: item.cantidad,
    precio_unitario: String(item.precio_unitario),
  };
});


    return { pedido, productos };
  }
}