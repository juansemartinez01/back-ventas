import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('listas_precios')
export class ListaPrecios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'date' })
  fecha: string;
}
