import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoManual } from './pedido-manual.entity';
import { CreatePedidoManualDto } from './dto/create-pedido-manual.dto';
import { UpdatePedidoManualDto } from './dto/update-pedido-manual.dto';

@Injectable()
export class PedidoManualService {
  constructor(
    @InjectRepository(PedidoManual)
    private readonly repo: Repository<PedidoManual>,
  ) {}

  findAll(): Promise<PedidoManual[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<PedidoManual> {
    const pm = await this.repo.findOneBy({ id });
    if (!pm) throw new NotFoundException(`PedidoManual ${id} no encontrado`);
    return pm;
  }

  create(dto: CreatePedidoManualDto): Promise<PedidoManual> {
    const pm = this.repo.create({
      clienteId: dto.clienteId,
      usuarioId: dto.usuarioId,
      mensajeOriginal: dto.mensajeOriginal,
      fechaCarga: new Date(dto.fechaCarga),
      pedidoId: dto.pedidoId,
    });
    return this.repo.save(pm);
  }

  async update(id: number, dto: UpdatePedidoManualDto): Promise<PedidoManual> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`PedidoManual ${id} no encontrado`);
  }
}