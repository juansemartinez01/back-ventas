import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usuario: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByUsername(usuario);
    if (user && await bcrypt.compare(pass, user.clave_hash)) {
      const { clave_hash, ...result } = user;
      // attach roles array
      result.roles = user.roles.map(r => ({
        id: r.id,
        usuarioId: r.usuarioId,
        usuario: r.usuario,
        rolId: r.rolId,
        rol: r.rol,
      }));
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
