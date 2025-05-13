import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../cliente/cliente.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Pedido } from '../pedido/pedido.entity';

@Entity('pedidos_manuales')
export class PedidoManual {
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

  @Column({ name: 'mensaje_original', type: 'text' })
  mensajeOriginal: string;

  @Column({ name: 'fecha_carga', type: 'timestamp' })
  fechaCarga: Date;

  @Column({ name: 'pedido_id', type: 'int', nullable: true })
  pedidoId?: number;

  @ManyToOne(() => Pedido, { eager: true, nullable: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido?: Pedido;
}