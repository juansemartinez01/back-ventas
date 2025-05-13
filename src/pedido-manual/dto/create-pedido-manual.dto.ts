import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreatePedidoManualDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  usuarioId: number;

  @IsString()
  @IsNotEmpty()
  mensajeOriginal: string;

  @IsDateString()
  fechaCarga: string;

  @IsInt()
  @IsOptional()
  pedidoId?: number;
}