import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EstadisticasService {
  constructor(private readonly dataSource: DataSource) {}

  // Acá después vas a agregar los métodos de cada estadística
  async getTotalPedidosPorPeriodo(
  periodo: 'dia' | 'semana' | 'mes',
  desde: string, // formato: 'YYYY-MM-DD'
  hasta: string  // formato: 'YYYY-MM-DD'
) {
  let campoGroup = '';
  switch (periodo) {
    case 'dia':
      campoGroup = 'DATE(fecha_hora)';
      break;
    case 'semana':
      campoGroup = "DATE_TRUNC('week', fecha_hora)";
      break;
    case 'mes':
      campoGroup = "DATE_TRUNC('month', fecha_hora)";
      break;
    default:
      throw new Error('Periodo no válido. Usar dia, semana o mes.');
  }

  const query = `
    SELECT ${campoGroup} AS periodo, COUNT(*) AS total
    FROM pedidos
    WHERE fecha_hora BETWEEN $1 AND $2
    GROUP BY ${campoGroup}
    ORDER BY periodo DESC
  `;

  return await this.dataSource.query(query, [desde, hasta]);
}


  async getCantidadProductosVendidos(
  periodo: 'dia' | 'semana' | 'mes',
  desde: string,
  hasta: string
) {
  let campoGroup = '';
  switch (periodo) {
    case 'dia':
      campoGroup = 'DATE(p.fecha_hora)';
      break;
    case 'semana':
      campoGroup = "DATE_TRUNC('week', p.fecha_hora)";
      break;
    case 'mes':
      campoGroup = "DATE_TRUNC('month', p.fecha_hora)";
      break;
    default:
      throw new Error('Periodo no válido. Usar dia, semana o mes.');
  }

  const query = `
    SELECT ${campoGroup} AS periodo, SUM(i.cantidad) AS cantidad_vendida
    FROM items_pedido i
    JOIN pedidos p ON p.id = i.pedido_id
    WHERE p.fecha_hora BETWEEN $1 AND $2
    GROUP BY ${campoGroup}
    ORDER BY periodo DESC
  `;

  return await this.dataSource.query(query, [desde, hasta]);
}

async getIngresosPorPeriodo(
  periodo: 'dia' | 'semana' | 'mes',
  desde: string,
  hasta: string
) {
  let campoGroup = '';
  switch (periodo) {
    case 'dia':
      campoGroup = 'DATE(p.fecha_hora)';
      break;
    case 'semana':
      campoGroup = "DATE_TRUNC('week', p.fecha_hora)";
      break;
    case 'mes':
      campoGroup = "DATE_TRUNC('month', p.fecha_hora)";
      break;
    default:
      throw new Error('Periodo no válido. Usar dia, semana o mes.');
  }

  const query = `
    SELECT ${campoGroup} AS periodo,
           SUM(i.precio_unitario * i.cantidad) AS ingresos_totales
    FROM items_pedido i
    JOIN pedidos p ON p.id = i.pedido_id
    WHERE p.fecha_hora BETWEEN $1 AND $2
    GROUP BY ${campoGroup}
    ORDER BY periodo DESC
  `;

  return await this.dataSource.query(query, [desde, hasta]);
}



}
