import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es'; // español para formateo

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('total-por-periodo')
  async getTotalPedidosPorPeriodo(
    @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    // Validación básica de fechas
    if (!periodo || !desde || !hasta) {
      throw new BadRequestException('Faltan parámetros obligatorios: periodo, desde o hasta');
    }

    const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
    if (!formatoValido.test(desde) || !formatoValido.test(hasta)) {
      throw new BadRequestException('Las fechas deben estar en formato YYYY-MM-DD');
    }

    const resultados = await this.estadisticasService.getTotalPedidosPorPeriodo(periodo, desde, hasta);

    // Formateo de las fechas para una mejor visualización
    const resultadosFormateados = resultados.map((r: any) => {
      let fechaLegible = '';

      switch (periodo) {
        case 'dia':
          fechaLegible = dayjs(r.periodo).format('DD/MM/YYYY');
          break;
        case 'semana':
          fechaLegible = `Semana del ${dayjs(r.periodo).format('DD/MM/YYYY')}`;
          break;
        case 'mes':
          fechaLegible = dayjs(r.periodo).format('MMMM YYYY'); // ej: "junio 2025"
          break;
      }

      return {
        periodo: fechaLegible,
        total: Number(r.total),
      };
    });

    return resultadosFormateados;
  }

  @Get('productos-vendidos')
  async getProductosVendidos(
    @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    if (!periodo || !desde || !hasta) {
      throw new BadRequestException('Faltan parámetros: periodo, desde o hasta');
    }

    const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
    if (!formatoValido.test(desde) || !formatoValido.test(hasta)) {
      throw new BadRequestException('Formato de fechas inválido. Usar YYYY-MM-DD');
    }

    const resultados = await this.estadisticasService.getCantidadProductosVendidos(periodo, desde, hasta);

    const resultadosFormateados = resultados.map((r: any) => {
      let fechaLegible = '';

      switch (periodo) {
        case 'dia':
          fechaLegible = dayjs(r.periodo).format('DD/MM/YYYY');
          break;
        case 'semana':
          fechaLegible = `Semana del ${dayjs(r.periodo).format('DD/MM/YYYY')}`;
          break;
        case 'mes':
          fechaLegible = dayjs(r.periodo).format('MMMM YYYY');
          break;
      }

      return {
        periodo: fechaLegible,
        cantidad_vendida: Number(r.cantidad_vendida),
      };
    });

    return resultadosFormateados;
  }

  @Get('ingresos')
async getIngresosPorPeriodo(
  @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
  @Query('desde') desde: string,
  @Query('hasta') hasta: string
) {
  if (!periodo || !desde || !hasta) {
    throw new BadRequestException('Faltan parámetros: periodo, desde o hasta');
  }

  const formatoValido = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatoValido.test(desde) || !formatoValido.test(hasta)) {
    throw new BadRequestException('Formato de fechas inválido. Usar YYYY-MM-DD');
  }

  const resultados = await this.estadisticasService.getIngresosPorPeriodo(periodo, desde, hasta);

  const formateados = resultados.map((r: any) => {
    let fechaLegible = '';
    switch (periodo) {
      case 'dia':
        fechaLegible = dayjs(r.periodo).format('DD/MM/YYYY');
        break;
      case 'semana':
        fechaLegible = `Semana del ${dayjs(r.periodo).format('DD/MM/YYYY')}`;
        break;
      case 'mes':
        fechaLegible = dayjs(r.periodo).format('MMMM YYYY');
        break;
    }

    return {
      periodo: fechaLegible,
      ingresos_totales: Number(r.ingresos_totales),
    };
  });

  return formateados;
}


@Get('promedio-generado-producto')
async getPromedioGeneradoProducto() {
  const resultados = await this.estadisticasService.getPromedioGeneradoPorProducto();

  return resultados.map(r => ({
    producto_id: r.producto_id,
    nombre: r.nombre,
    promedio_precio: Number(r.promedio_precio),
  }));
}




}
