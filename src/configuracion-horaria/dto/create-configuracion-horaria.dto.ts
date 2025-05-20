import { IsString, IsNotEmpty, MaxLength, IsBoolean, Matches, Min, Max, IsInt } from 'class-validator';

export class CreateConfiguracionHorariaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dia: string;

  @IsInt()
  @Min(0)
  @Max(6)
  idDia: number;


  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  horaInicio: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  horaFin: string;

  @IsBoolean()
  habilitado: boolean;
}