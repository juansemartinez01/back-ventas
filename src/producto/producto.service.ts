import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.repo.find({
      relations: [
        'unidad',
        'tipoProducto',
        'stocksActuales',        // ← traemos el stock actual
        // 'movimientosStock',   // ← si además quieres los movimientos
      ],
    });
  }

  // findOne(id: number): Promise<Producto> {
  //   return this.repo.findOne({
  //     where: { id },
  //     relations: [
  //       'unidad',
  //       'tipoProducto',
  //       'stocksActuales',        // ← aquí también
  //       // 'movimientosStock',
  //     ],
  //   });
  // }

  // findAll(): Promise<Producto[]> {
  //   return this.repo.find();
  // }

  async findOne(id: number): Promise<Producto> {
    const prod = await this.repo.findOne({
       where: { id },
       relations: [
         'unidad',
         'tipoProducto',
         'stocksActuales',        // ← aquí también
         // 'movimientosStock',
       ],
     });
    if (!prod) throw new NotFoundException(`Producto ${id} no encontrado`);
    return prod;
  }

  async create(dto: CreateProductoDto): Promise<Producto> {
    const prod = this.repo.create(dto);
    const saved = await this.repo.save(prod);

    // 2) Recargar con relaciones para devolver el mismo payload que GET
    const producto = await this.repo.findOne({
      where: { id: saved.id },
      relations: [
        'unidad',
        'tipoProducto',
        
        
        // añade aquí otras relaciones si las tienes:
        // 'stockActual', 'parametrosReorden', etc.
      ],
    });
    if (!producto) throw new NotFoundException(`Producto ${saved.id} no encontrado`);
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`Producto ${id} no encontrado`);
  }
}