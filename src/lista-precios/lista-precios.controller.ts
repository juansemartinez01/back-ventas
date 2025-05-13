import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ListaPreciosService } from './lista-precios.service';
import { CreateListaPreciosDto } from './dto/create-lista-precios.dto';
import { UpdateListaPreciosDto } from './dto/update-lista-precios.dto';
import { ListaPrecios } from './lista-precios.entity';

@Controller('listas-precios')
export class ListaPreciosController {
  constructor(private readonly service: ListaPreciosService) {}

  @Get()
  getAll(): Promise<ListaPrecios[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ListaPrecios> {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateListaPreciosDto): Promise<ListaPrecios> {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateListaPreciosDto,
  ): Promise<ListaPrecios> {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(+id);
  }
}