import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuarios/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usuario: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(usuario);
    if (user && await bcrypt.compare(pass, user.clave_hash)) {
      const { clave_hash, ...result } = user;
      // attach roles array
      result.roles = user.roles.map(r => r.rol.nombre);
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.usuario, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
