import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 50 })
  telefono: string;

  @Column({ length: 500 })
  direccion: string;

  @Column({ length: 50 })
  tipo: string;

  @Column('decimal', { precision: 12, scale: 2 })
  descuento: number;

  @Column('decimal', { precision: 14, scale: 2 })
  saldo_cuenta_corriente: number;
}