import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrecioProductoLista } from './precio-producto-lista.entity';
import { CreatePrecioProductoListaDto } from './dto/create-precio-producto-lista.dto';
import { UpdatePrecioProductoListaDto } from './dto/update-precio-producto-lista.dto';

@Injectable()
export class PrecioProductoListaService {
  constructor(
    @InjectRepository(PrecioProductoLista)
    private readonly repo: Repository<PrecioProductoLista>,
  ) {}

  findAll(): Promise<PrecioProductoLista[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<PrecioProductoLista> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new NotFoundException(`PrecioProductoLista ${id} no encontrado`);
    return entity;
  }

  async create(dto: CreatePrecioProductoListaDto): Promise<PrecioProductoLista> {
  // 1. Verificar si ya existe ese producto en esa lista
  const existente = await this.repo.findOne({
    where: {
      lista: { id: dto.listaId },
      producto: { id: dto.productoId },
    },
  });

  if (existente) {
    throw new ConflictException(
      `Ya existe un precio asignado para el producto ${dto.productoId} en la lista ${dto.listaId}`
    );
  }

  // 2. Crear el nuevo registro
  const entity = new PrecioProductoLista();
  entity.lista = { id: dto.listaId } as any;
  entity.producto = { id: dto.productoId } as any;
  entity.precioUnitario = dto.precioUnitario;
  entity.oferta = dto.oferta ?? false;
  entity.precioOferta = dto.precio_oferta ?? undefined;

  return this.repo.save(entity);
}

  async update(id: number, dto: UpdatePrecioProductoListaDto): Promise<PrecioProductoLista> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`PrecioProductoLista ${id} no encontrado`);
  }

  async eliminarPorProductoYLista(listaId: number, productoId: number): Promise<void> {
    const res = await this.repo.delete({  lista: { id: listaId } ,producto: { id: productoId }});
    if (res.affected === 0) {
      throw new NotFoundException(`No se encontró precio para producto ${productoId} en lista ${listaId}`);
    }
  }
}
