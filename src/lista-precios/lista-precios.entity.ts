import { Cliente } from 'src/cliente/cliente.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('listas_precios')
export class ListaPrecios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'date' })
  fecha: string;

  @OneToMany(() => Cliente, c => c.listaPrecios)
  clientes: Cliente[];
}
