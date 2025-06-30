import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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

  if (periodo === 'dia') {
    return this.getIngresosPorDiaDesdeVista(desde, hasta);
  }

  if (periodo === 'semana') {
    return this.getIngresosPorSemanaDesdeVista(desde, hasta);
  }

  if (periodo === 'mes') {
    return this.getIngresosPorMesDesdeVista(desde, hasta);
  }
  // Si no es ni dia, ni semana, ni mes, lanzamos un error
  throw new Error('Periodo no válido. Usar dia, semana o mes.');

  
}


async getIngresosPorDiaDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT dia AS periodo, ingresos_totales
    FROM ingresos_por_dia
    WHERE dia BETWEEN $1 AND $2
    ORDER BY dia DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}






async getIngresosPorSemanaDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT semana AS periodo, ingresos_totales
    FROM ingresos_por_semana
    WHERE semana BETWEEN $1 AND $2
    ORDER BY semana DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}


async getIngresosPorMesDesdeVista(desde: string, hasta: string) {
  const query = `
    SELECT mes AS periodo, ingresos_totales
    FROM ingresos_por_mes
    WHERE mes BETWEEN $1 AND $2
    ORDER BY mes DESC
  `;
  return await this.dataSource.query(query, [desde, hasta]);
}


async getPromedioGeneradoPorProducto() {
  const query = `SELECT * FROM "public"."promedio_precio_producto" ORDER BY promedio_precio DESC`;
  return await this.dataSource.query(query);
}


async refrescarPromedioPrecioProducto() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW promedio_precio_producto');
}






@Cron('0 0 * * *') // todos los días a la medianoche
async refrescarVistasEstadisticas() {
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_dia');
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_semana');
  await this.dataSource.query('REFRESH MATERIALIZED VIEW ingresos_por_mes');
  await this.refrescarPromedioPrecioProducto();
}

}
