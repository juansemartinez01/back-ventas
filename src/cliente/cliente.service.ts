import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.repo.findOneBy({ id });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  create(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.repo.create(dto);
    return this.repo.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Cliente ${id} no encontrado`);
  }

  async buscarPorNombreOTelefono(query: string): Promise<Cliente[]> {
  return this.repo.find({
    where: [
      { nombre: ILike(`%${query}%`) },
      { telefono: ILike(`%${query}%`) }
    ],
    take: 10, // límite opcional
    order: { nombre: 'ASC' }
  });
}

}