import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionHoraria } from './configuracion-horaria.entity';
import { CreateConfiguracionHorariaDto } from './dto/create-configuracion-horaria.dto';
import { UpdateConfiguracionHorariaDto } from './dto/update-configuracion-horaria.dto';

@Injectable()
export class ConfiguracionHorariaService {
  constructor(
    @InjectRepository(ConfiguracionHoraria)
    private readonly repo: Repository<ConfiguracionHoraria>,
  ) {}

  findAll(): Promise<ConfiguracionHoraria[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<ConfiguracionHoraria> {
    const config = await this.repo.findOneBy({ id });
    if (!config) throw new NotFoundException(`ConfiguracionHoraria ${id} no encontrada`);
    return config;
  }

  create(dto: CreateConfiguracionHorariaDto): Promise<ConfiguracionHoraria> {
    const config = this.repo.create(dto);
    return this.repo.save(config);
  }

  async update(id: number, dto: UpdateConfiguracionHorariaDto): Promise<ConfiguracionHoraria> {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0)
      throw new NotFoundException(`ConfiguracionHoraria ${id} no encontrada`);
  }
}