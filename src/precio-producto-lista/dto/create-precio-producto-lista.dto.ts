import { IsInt, Min, IsNumber } from 'class-validator';

export class CreatePrecioProductoListaDto {
  @IsInt()
  listaId: number;

  @IsInt()
  productoId: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;
}