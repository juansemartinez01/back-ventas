import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';
import { Pedido } from 'src/pedido/pedido.entity';
import { Producto } from 'src/producto/producto.entity';
import { PrecioProductoLista } from 'src/precio-producto-lista/precio-producto-lista.entity';


// 1) Creamos un tipo que no exige preciosEnListas
type ProductoConCantidad = Omit<Producto, 'preciosEnListas'> & {
  cantidad: number;
  precio_unitario: string;
};

@Injectable()
export class ItemPedidoService {
  constructor(
    @InjectRepository(ItemPedido)
    private readonly repo: Repository<ItemPedido>,
    @InjectRepository(PrecioProductoLista)
    private readonly precioListaRepo: Repository<PrecioProductoLista>,
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
  productos: ProductoConCantidad[];
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
        'producto.stocksActuales',
        'producto.movimientosStock',
      ],
    });

    if (items.length === 0) {
      throw new NotFoundException(`No se encontraron items para el pedido ${pedidoId}`);
    }

    // 2) Extraigo el pedido y la lista de precios asignada al cliente (puede ser null)
    const { pedido } = items[0];
    const listaId = pedido.cliente.listaPreciosId;

    // 3) Si hay lista, cargo todos sus precios de una sola vez
    let entradasDePrecio: PrecioProductoLista[] = [];
    if (listaId) {
      entradasDePrecio = await this.precioListaRepo.find({
        where: { listaId },
      });
    }
    // Construyo un map productoId → precioUnitario
    const precioMap = new Map<number, number>();
    for (const e of entradasDePrecio) {
      precioMap.set(e.productoId, e.precioUnitario);
    }

    // 4) Mapear items a ProductoConCantidad, eligiendo:
    //    - precio de lista si existe
    //    - o precio_base del producto
const productos: ProductoConCantidad[] = items.map(item => {
  const p = item.producto;
  const precioDeLista = precioMap.get(p.id);
  const precio_unitario = precioDeLista != null
    ? precioDeLista.toString()
    : p.precio_base.toString();
  return {
    // todas las props de Producto excepto 'preciosEnListas'
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
    stocksActuales: p.stocksActuales,
    movimientosStock: p.movimientosStock,

    // campos del item
    itemPedidoId:    item.id,
    cantidad: item.cantidad,
    precio_unitario: precio_unitario,
  };
});


    return { pedido, productos };
  }
}