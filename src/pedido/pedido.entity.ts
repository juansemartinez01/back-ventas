import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id', type: 'int' })
  clienteId: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'usuario_id', type: 'int' })
  usuarioId: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;

  @Column({ length: 50 })
  canal: string;

  @Column({ length: 50 })
  estado: string;

  @Column({ name: 'armador_id', type: 'int', nullable: true })
  armadorId?: number;

  @ManyToOne(() => Usuario, { eager: true, nullable: true })
  @JoinColumn({ name: 'armador_id' })
  armador?: Usuario;

  @Column({ name: 'entregador_id', type: 'int', nullable: true })
  entregadorId?: number;

  @ManyToOne(() => Usuario, { eager: true, nullable: true })
  @JoinColumn({ name: 'entregador_id' })
  entregador?: Usuario;

  @Column({ name: 'estado_pago', length: 50 })
  estadoPago: string;
}