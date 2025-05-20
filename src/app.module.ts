import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './cliente/cliente.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RoleModule } from './role/role.module';
import { UsuarioRolModule } from './usuario-rol/usuario-rol.module';
import { ProductoModule } from './producto/producto.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { UnidadModule } from './unidad/unidad.module';
import { StockModule } from './stock/stock.module';
import { PedidoModule } from './pedido/pedido.module';
import { ItemPedidoModule } from './item-pedido/item-pedido.module';
import { FacturaModule } from './factura/factura.module';
import { TicketArmadoModule } from './ticket-armado/ticket-armado.module';
import { MovimientoCuentaCorrienteModule } from './movimiento-cuenta-corriente/movimiento-cuenta-corriente.module';
import { PedidoManualModule } from './pedido-manual/pedido-manual.module';
import { ListaPreciosModule } from './lista-precios/lista-precios.module';
import { PrecioProductoListaModule } from './precio-producto-lista/precio-producto-lista.module';
import { PrecioDelDiaModule } from './precio-del-dia/precio-del-dia.module';
import { VentasMensualesModule } from './ventas-mensuales/ventas-mensuales.module';
import { ConfiguracionHorariaModule } from './configuracion-horaria/configuracion-horaria.module';
import { ProductosMasVendidosModule } from './productos-mas-vendidos/productos-mas-vendidos.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,    // Carga automáticamente las entidades de los forFeature()
        synchronize: true,      // en dev true, en prod false
        migrations: ['dist/migrations/*.js'],
        // opcionalmente:
        // logging: true,
      }),
      inject: [ConfigService],
    }),

    ClienteModule,

    UsuarioModule,

    RoleModule,

    UsuarioRolModule,

    ProductoModule,

    TipoProductoModule,

    UnidadModule,

    StockModule,

    PedidoModule,

    ItemPedidoModule,

    FacturaModule,

    TicketArmadoModule,

    MovimientoCuentaCorrienteModule,

    PedidoManualModule,

    ListaPreciosModule,

    PrecioProductoListaModule,

    PrecioDelDiaModule,

    VentasMensualesModule,

    ConfiguracionHorariaModule,

    ProductosMasVendidosModule,

    AuthModule,

    FilesModule,

    // …aquí vendrán después los módulos de tus entidades
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
