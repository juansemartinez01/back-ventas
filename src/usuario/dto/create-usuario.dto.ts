import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usuario: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  clave_hash: string;

  @IsEmail()
  @MaxLength(255)
  email: string;
}
