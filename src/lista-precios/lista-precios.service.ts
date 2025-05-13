import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListaPrecios } from './lista-precios.entity';
import { CreateListaPreciosDto } from './dto/create-lista-precios.dto';
import { UpdateListaPreciosDto } from './dto/update-lista-precios.dto';

@Injectable()
export class ListaPreciosService {
  constructor(
    @InjectRepository(ListaPrecios)
    private readonly repo: Repository<ListaPrecios>,
  ) {}

  findAll(): Promise<ListaPrecios[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ListaPrecios> {
    const lista = await this.repo.findOneBy({ id });
    if (!lista) throw new NotFoundException(`ListaPrecios ${id} no encontrada`);
    return lista;
  }

  create(dto: CreateListaPreciosDto): Promise<ListaPrecios> {
    const lista = this.repo.create(dto);
    return this.repo.save(lista);
  }

  async update(id: number, dto: UpdateListaPreciosDto): Promise<ListaPrecios> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`ListaPrecios ${id} no encontrada`);
  }
}