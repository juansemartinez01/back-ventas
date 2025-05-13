import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('configuracion_horaria')
export class ConfiguracionHoraria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  dia: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column()
  habilitado: boolean;
}
