import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';
import { CreateItemPedidoDto } from './dto/create-item-pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item-pedido.dto';

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
}