import { UsuarioRol } from 'src/usuario-rol/usuario-rol.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 100, unique: true })
  usuario: string;

  @Column({ name: 'clave_hash', length: 255 })
  clave_hash: string;

  @Column({ length: 255, unique: true })
  email: string;

  @OneToMany(() => UsuarioRol, usuarioRol => usuarioRol.usuario)
  roles: UsuarioRol[];
}