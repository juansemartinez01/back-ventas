import { IsInt, Min, IsNumber } from 'class-validator';

export class CreateItemPedidoDto {
  @IsInt()
  pedidoId: number;

  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;
}
