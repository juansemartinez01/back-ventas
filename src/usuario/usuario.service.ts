import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  

  // For authentication: find by username and include roles
  async findByUsername(usuario: string): Promise<Usuario | null> {
    return this.repo.findOne({
      where: { usuario },
      relations: ['roles', 'roles.rol'],
    });
  }

  findAll(): Promise<Usuario[]> {
    return this.repo.find({ relations: ['roles', 'roles.rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['roles', 'roles.rol'],
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
  const user = new Usuario();
  user.nombre = dto.nombre;
  user.usuario = dto.usuario;
  user.email = dto.email;
  // generamos el hash aquí
  user.clave_hash = await bcrypt.hash(dto.password, 10);
  return this.repo.save(user);
}

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
  const user = await this.repo.findOneBy({ id });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (dto.nombre !== undefined) {
    user.nombre = dto.nombre;
  }

  if (dto.usuario !== undefined) {
    user.usuario = dto.usuario;
  }

  if (dto.email !== undefined) {
    user.email = dto.email;
  }

  if (dto.password !== undefined) {
    user.clave_hash = await bcrypt.hash(dto.password, 10);
  }

  if (dto.clienteId !== undefined) {
    user.clienteId = dto.clienteId;
  }

  if (dto.activo !== undefined) {
    user.activo = dto.activo;
  }

  return this.repo.save(user);
}



  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException(`Usuario ${id} no encontrado`);
  }
}