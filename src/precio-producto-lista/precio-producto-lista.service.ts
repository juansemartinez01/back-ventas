import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(dto: CreatePrecioProductoListaDto): Promise<PrecioProductoLista> {
    const entity = this.repo.create({
      listaId: dto.listaId,
      productoId: dto.productoId,
      precioUnitario: dto.precioUnitario,
    });
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
}
