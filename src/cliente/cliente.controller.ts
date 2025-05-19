import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './cliente.entity';
import { Roles } from 'src/auth/roles.decorator';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  @Get()
  @Roles('Admin')
  getAll(): Promise<Cliente[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('Admin')
  getOne(@Param('id') id: string): Promise<Cliente> {
    return this.service.findOne(+id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateClienteDto): Promise<Cliente> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}
